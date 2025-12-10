import { useDialog } from '@contexts/DialogContext';
import { useSession } from '@contexts/SessionContext';
import { reatomComponent, useAction, useAtom } from '@reatom/npm-react';
import { Box, VBox } from '@ui/box/Box';
import Button from '@ui/button/Button';
import { IconClose } from '@ui/icons';
import Spacer from '@ui/spacer/Spacer';
import { Spinner } from '@ui/spinner/Spinner';
import { Typo } from '@ui/text/Typo';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	canvasSrcAtom,
	ctxSrcAtom,
	facingModeAtom,
	isLoadingAtom,
	releaseCameraAction,
	streamAtom,
	streamErrorAtom,
	switchCameraMode,
	takePhotoAction,
} from 'src/models/Camera';
import { canvasDstAtom, drawFrame, fmErrorAtom, fmSuggestionAtom, isInitializedAtom } from 'src/models/FaceMesh';
import { sessionIDAtom } from 'src/models/Session';
import { sendSelfie, sendSelfieStatus } from 'src/services/api';
import { useCheckMobileDevice } from 'src/utils';
import { styled } from 'styled-components';
import { debounce } from 'throttle-debounce';
import { Video } from '../Video/Video';
import { SelfieCancel } from './Canceled';
import { PreviewSelfie } from './Preview';
import { SelfieSentError } from './SentError';
import { SelfieSent } from './SentSuccess';

type Status = 'camera' | 'sending' | 'sent' | 'error' | 'criticalError' | 'canceled' | 'preview';

const CanvasEl = styled.canvas`
	pointer-events: none;
`;

const FRAME_INTERVAL = 30; // 30fps max

export const SelfieComponent: FC = reatomComponent(() => {
	const { t } = useTranslation();
	const { showDialog } = useDialog();
	const isMobile = useCheckMobileDevice();

	const cameraPermission = !!useAtom(streamAtom)[0];
	const [suggestion] = useAtom(fmSuggestionAtom);
	const [canvas, setCanvas] = useAtom(canvasDstAtom);
	const [isInitializedFM] = useAtom(isInitializedAtom);
	const [isLoadingStream] = useAtom(isLoadingAtom);
	const [streamError] = useAtom(streamErrorAtom);
	const [fmError] = useAtom(fmErrorAtom);
	const [sessionId, setSessionId] = useAtom(sessionIDAtom);
	const [canvasSrc] = useAtom(canvasSrcAtom);
	const [facingMode] = useAtom(facingModeAtom);
	const [ctxSrc] = useAtom(ctxSrcAtom);

	const processFrame = useAction(drawFrame);
	const takePhoto = useAction(takePhotoAction);
	const releaseCamera = useAction(releaseCameraAction);
	const setCameraMode = useAction(switchCameraMode);

	const [isEmbedded, setIsEmbedded] = useState(false);
	const lastProcessTimeRef = useRef(0);
	const frameIdRef = useRef(0);
	const [status, setStatus] = useState<Status>('camera');
	const [apiError, setApiError] = useState<string>();

	const isLoading = isLoadingStream || !isInitializedFM;
	const error = streamError || fmError;

	const { targetOrigin } = useSession();
	const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

	// States
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [suggestionToShow, setSuggestionToShow] = useState(t(suggestion ?? ''));

	const processVideoFrame = useCallback(
		(timestamp: number) => {
			if (timestamp - lastProcessTimeRef.current > FRAME_INTERVAL) {
				lastProcessTimeRef.current = timestamp;
				processFrame();
			}

			frameIdRef.current = requestAnimationFrame(processVideoFrame);
		},
		[processFrame],
	);

	useEffect(() => {
		try {
			setIsEmbedded(window.self !== window.top);
		} catch (err) {
			console.error('[SessionProvider] Error on setting isEmbedded:', err);
			setIsEmbedded(true);
		}
	}, []);

	useEffect(() => {
		frameIdRef.current = requestAnimationFrame(processVideoFrame);

		return () => {
			cancelAnimationFrame(frameIdRef.current);
		};
	}, [processVideoFrame]);

	useEffect(() => {
		if (suggestion?.startsWith('fit_') || suggestion?.startsWith('move_') || suggestion?.startsWith('turn_')) {
			setSuggestionToShow(t(suggestion));
			return;
		}
		if (suggestion?.startsWith('no_face_')) {
			setSuggestionToShow(t('fit_face_into_oval'));
			return;
		}
		setSuggestionToShow('');
	}, [suggestion]);

	useEffect(() => {
		if (status === 'sent') setCameraMode(null);
	}, [status]);

	useEffect(() => {
		if (!sessionId) return;
		sendSelfieStatus(sessionId, 'opened');
	}, [sessionId]);

	// Set correct dimensions for canvas
	useEffect(() => {
		const handleResize = debounce(30, () => {
			if (!(canvas && canvasSrc)) return;
			const parentRect = parentRef?.getBoundingClientRect();
			if (!parentRect) return;

			canvas.width = parentRect.width;
			canvas.height = parentRect.height;

			canvas.style.width = `${parentRect.width}px`;
			canvas.style.height = `${parentRect.height}px`;

			canvasSrc.width = parentRect.width;
			canvasSrc.height = parentRect.height;
			if (ctxSrc && facingMode === 'user') {
				ctxSrc.translate(canvas?.width ?? 0, 0);
				ctxSrc.scale(-1, 1);
			}
		});
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [parentRef, canvas, canvasSrc, ctxSrc, facingMode]);

	const onTakePhoto = async () => {
		if (suggestionToShow) {
			const s = suggestionToShow;
			setSuggestionToShow(t('place_face_inside_oval'));
			setTimeout(() => setSuggestionToShow?.(s), 5000);
			return;
		}
		const photo = await takePhoto(true);
		if (photo) {
			setCapturedImage(photo);
			setStatus('preview');
			if (isEmbedded) window.parent.postMessage({ type: 'HIDE_BACK_BUTTON' }, targetOrigin);
		}
	};

	// Handle cancel
	const handleCancel = async () => {
		const choice = await showDialog({
			title: t('verification'),
			content: t('cancel_verification_question'),
			buttons: [{ title: t('cancel_accept') }, { title: t('cancel_reject') }],
		});

		if (choice === 0) {
			await releaseCamera();
			sendSelfieStatus(sessionId ?? '', 'canceled');
			setSessionId(null);
			if (isEmbedded) {
				window.parent.postMessage({ type: 'BUTTON_CLOSE_CLICK' }, targetOrigin);
			}
			setStatus('canceled');
		}
	};

	const onSendPhoto = async () => {
		if (!sessionId) return;
		if (!capturedImage) {
			console.warn('No captured image');
			releaseCamera();
			return;
		}

		setStatus('sending');
		if (isEmbedded) window.parent.postMessage({ type: 'SEND_SELFIE', img: capturedImage }, targetOrigin);
		const res = await sendSelfie(sessionId, capturedImage);

		// 1092 - similarity failed, but it's 'soft' error and user can try again
		setStatus(res.data === true ? 'sent' : res.error?.code === 1092 ? 'error' : 'criticalError');
		if (res.error) {
			if (res.error.code === 1092) {
				setApiError(t('similarity_failed'));
				return;
			}
			setApiError(res.error.details || res.error.message);
		}
	};

	return (
		<Box
			sx={
				isMobile || isEmbedded
					? { width: '100vw', height: '100%' }
					: { display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center' }
			}
		>
			<Box
				sx={
					isMobile || isEmbedded
						? { width: '100%', height: '100%' }
						: {
								maxWidth: '600px',
								margin: '20px',
								width: '100%',
								height: 'calc(100% - 40px)',
								borderRadius: '20px',
								overflowY: 'hidden',
								boxShadow: '0px 0px 40px rgba(0,0,0,.1)',
							}
				}
			>
				<Box
					ref={setParentRef}
					sx={{
						position: 'relative',
						overflow: 'hidden',
						width: '100%',
						height: '100%',
						backgroundColor: 'black',
						flexGrow: 1,
					}}
				>
					<Box style={status === 'camera' ? {} : { visibility: 'hidden', position: 'absolute' }}>
						<Video />
						<CanvasEl ref={setCanvas} />
					</Box>

					{/* UI overlay */}
					{status === 'camera' && (
						<>
							<VBox
								style={{
									top: 0,
									left: 0,
								}}
								sx={{
									position: 'absolute',
									width: '100%',
									height: '100%',
									padding: '20px',
									color: 'white',
									zIndex: 2,
								}}
							>
								{/* Close button */}
								{!isEmbedded && (
									<Box
										sx={{
											position: 'absolute',
											top: '20px',
											right: '20px',
											padding: '10px',
											cursor: 'pointer',
										}}
										onClick={handleCancel}
									>
										<IconClose />
									</Box>
								)}

								{!isEmbedded && <Spacer size="48px" />}

								{/* Title */}
								<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('take_selfie_title')}</Typo>

								<Spacer size="10px" />

								{/* Instructions/Suggestion */}
								<Typo sx={{ fontSize: '16px', textAlign: 'center' }}>
									{!isLoadingStream && isInitializedFM && cameraPermission ? suggestionToShow : t('no_camera_permission')}
								</Typo>

								{/* Camera error */}
								{error && (
									<>
										<Spacer size="10px" />
										<Typo sx={{ fontSize: '16px', textAlign: 'center', color: 'red' }}>{error}</Typo>
									</>
								)}

								<Spacer grow />

								{/* Take photo button */}
								<Box sx={{ backgroundColor: 'white', borderRadius: '6px' }}>
									<Button variant="secondary" sx={{ fontWeight: '500' }} onClick={onTakePhoto}>
										{t('take_photo')}
									</Button>
								</Box>

								<Spacer size="20px" />
							</VBox>

							{/* Loading spinner */}
							{isLoading && !error && (
								<Box
									sx={{
										position: 'absolute',
										top: '0',
										left: '0',
										width: '100%',
										height: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: 'rgba(0, 0, 0, 0.5)',
										zIndex: 20,
									}}
								>
									<VBox center>
										<Spinner color="white" />
										<Spacer size="10px" />
										<Typo color="white">{t('initializing_camera')}</Typo>
									</VBox>
								</Box>
							)}
						</>
					)}

					{status === 'sending' && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								position: 'relative',
								overflow: 'hidden',
								width: '100%',
								height: '100%',
								flexGrow: 1,
								alignItems: 'center',
								justifyContent: 'center',
								padding: '1rem',
								backgroundColor: '#fafafa',
							}}
						>
							<Spinner />
						</Box>
					)}

					{(status === 'error' || status === 'criticalError') && (
						<SelfieSentError
							isCritical={status === 'criticalError'}
							error={apiError}
							onRetake={() => {
								setCapturedImage(null);
								setStatus('camera');
							}}
						/>
					)}

					{status === 'sent' && <SelfieSent isEmbedded={isEmbedded} targetOrigin={targetOrigin} />}

					{status === 'canceled' && <SelfieCancel />}

					{status === 'preview' && capturedImage && (
						<Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
							<PreviewSelfie
								photo={capturedImage}
								onRetake={() => {
									setCapturedImage(null);
									setStatus('camera');
									if (isEmbedded) window.parent.postMessage({ type: 'SHOW_BACK_BUTTON' }, targetOrigin);
								}}
								onApply={onSendPhoto}
								isEmbedded={isEmbedded}
							/>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
});
