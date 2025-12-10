import { useCallback, useEffect, useRef, useState } from 'react';
import { keyframes, styled } from 'styled-components';
import { Box, VBox } from '@ui/box/Box';
import { Typo } from '@ui/text/Typo';
import Spacer from '@ui/spacer/Spacer';
import { Spinner } from '@ui/spinner/Spinner';
import { useSession } from '@contexts/SessionContext';
import { IconClose } from '@ui/icons';
import { useDialog } from '@contexts/DialogContext';
import { useTranslation } from 'react-i18next';
import { Informer, InformerState } from '../Informer';
import { AppPage } from '../../App';
import { Video } from '../Video/Video';
import { useAction, useAtom } from '@reatom/npm-react';
import {
	canvasSrcAtom,
	ctxSrcAtom,
	facingModeAtom,
	isLoadingAtom,
	releaseCameraAction,
	streamAtom,
	streamErrorAtom,
	takePhotoAction,
} from 'src/models/Camera';
import { canvasDstAtom, drawFrame, fmErrorAtom, fmSuggestionAtom, isInitializedAtom, livenessDetectedAtom } from 'src/models/FaceMesh';
import { ArrowCircltRightOutlined } from '../icons/ArrowCircleRightOutlined';
import { ArrowCircleLeftOutlined } from '../icons/ArrowCircleLeftOutlined';
import { createFingerprint } from 'src/utils/fingerprint';

const CanvasEl = styled.canvas`
	pointer-events: none;
`;

const REQUIRED_IMAGES_COUNT = 5;
const FRAME_INTERVAL = 30; // 30fps max

interface LivenessComponentProps {
	onNavigate: (page: AppPage) => void;
}

export const LivenessComponent = ({ onNavigate }: LivenessComponentProps) => {
	const { t } = useTranslation();
	const { showDialog } = useDialog();

	const cameraPermission = !!useAtom(streamAtom)[0];
	const [suggestion] = useAtom(fmSuggestionAtom);
	const [canvas, setCanvas] = useAtom(canvasDstAtom);
	const [canvasSrc] = useAtom(canvasSrcAtom);
	const [isInitializedFM] = useAtom(isInitializedAtom);
	const [isLoadingStream] = useAtom(isLoadingAtom);
	const [streamError] = useAtom(streamErrorAtom);
	const [fmError] = useAtom(fmErrorAtom);
	const [livenessDetected] = useAtom(livenessDetectedAtom);
	const [facingMode] = useAtom(facingModeAtom);
	const [ctxSrc] = useAtom(ctxSrcAtom);

	const processFrame = useAction(drawFrame);
	const takePhoto = useAction(takePhotoAction);
	const releaseCamera = useAction(releaseCameraAction);

	const lastProcessTimeRef = useRef(0);
	const frameIdRef = useRef(0);

	const isLoading = isLoadingStream || !isInitializedFM;
	const error = streamError || fmError;

	const needShowArrow = !isLoadingStream && isInitializedFM && cameraPermission && suggestion?.includes('good');

	const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null);

	const { verifyLiveness, livenessVerified, requiredSteps, setCurrentStep, modifyPayload } = useSession();

	// States
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [informerState, setInformerState] = useState<InformerState>('busy');
	const [processingLiveness, setProcessingLiveness] = useState(false);
	const [checkError, setCheckError] = useState('');

	const [livenessImages, setLivenessImages] = useState<string[]>([]);
	const lastImageCaptureTime = useRef<number>(0);

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
		frameIdRef.current = requestAnimationFrame(processVideoFrame);

		return () => {
			cancelAnimationFrame(frameIdRef.current);
		};
	}, [processVideoFrame]);

	// Set correct dimensions for canvas
	useEffect(() => {
		const handleResize = () => {
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
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [parentRef, canvas, canvasSrc, facingMode, ctxSrc]);

	// Process liveness verification
	const processLiveness = useCallback(
		async (photos: string[]) => {
			setInformerState('busy');
			setProcessingLiveness(true);

			try {
				// Send Fingerprint
				const fingerprint = await createFingerprint();
				await modifyPayload({ fingerprintKyc: fingerprint });
				// Call API to verify liveness
				const result = await verifyLiveness(photos);

				// Process response
				if (result.status === 'success') {
					setInformerState('success');
				} else {
					if (result.code === 106) {
						setCheckError(result.details);
					}
					setLivenessImages([]);
					setInformerState('error');
				}
			} catch (err) {
				console.error('Liveness verification error:', err);
				setInformerState('error');
			} finally {
				setProcessingLiveness(false);
			}
		},
		[verifyLiveness],
	);

	// Auto-capture when liveness detected
	useEffect(() => {
		if (livenessDetected && !processingLiveness && !capturedImage) {
			const currentTime = Date.now();

			if (currentTime - lastImageCaptureTime.current > 500) {
				lastImageCaptureTime.current = currentTime;
				takePhoto().then((photo) => {
					if (photo) {
						setLivenessImages((prev) => [...prev, photo]);

						if (livenessImages.length + 1 >= REQUIRED_IMAGES_COUNT) {
							const allImages = [...livenessImages, photo];
							setCapturedImage(photo);
							processLiveness(allImages);
						}
					}
				});
			}
		}
	}, [livenessDetected, processingLiveness, capturedImage, livenessImages, takePhoto, processLiveness]);

	// Handle continue from informer
	const handleInformerContinue = async (retake: boolean) => {
		if (retake) {
			setCapturedImage(null);
			setLivenessImages([]);
			return;
		}

		if (livenessVerified) {
			const currentIndex = requiredSteps.indexOf('liveness');
			const nextStep = requiredSteps[currentIndex + 1] || null;

			await releaseCamera();

			if (nextStep) {
				setCurrentStep(nextStep);
			} else {
				onNavigate('result');
			}
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
			onNavigate('begin');
		}
	};

	return (
		<Box
			ref={setParentRef}
			sx={{
				position: 'relative',
				overflow: 'hidden',
				width: '100%',
				backgroundColor: 'black',
				flexGrow: 1,
			}}
		>
			<Video />
			<CanvasEl ref={setCanvas} />

			{/* UI overlay */}
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

				<Spacer size="48px" />

				{/* Title */}
				<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('liveness_check')}</Typo>

				<Spacer size="10px" />

				{/* Instructions/Suggestion */}
				<Typo sx={{ fontSize: '16px', textAlign: 'center' }}>
					{!isLoadingStream && isInitializedFM && cameraPermission
						? (suggestion && t(suggestion)) || t('turn_head_side_to_side')
						: t('no_camera_permission')}
				</Typo>
				<Box sx={{ width: '100%', display: 'flex', marginTop: '30px' }}>
					<BlinkingBox $animating={needShowArrow && livenessImages.length > 2} style={{ opacity: 0 }}>
						<ArrowCircleLeftOutlined color="#0f0" width={50} height={50} />
					</BlinkingBox>
					<BlinkingBox $animating={needShowArrow && livenessImages.length <= 2} style={{ marginLeft: 'auto', opacity: 0 }}>
						<ArrowCircltRightOutlined color="#0f0" width={50} height={50} />
					</BlinkingBox>
				</Box>

				{/* Camera error */}
				{error && (
					<>
						<Spacer size="10px" />
						<Typo sx={{ fontSize: '16px', textAlign: 'center', color: 'red' }}>{error}</Typo>
					</>
				)}

				<Spacer grow />

				{/* Additional instructions */}
				<Typo sx={{ fontSize: '16px', textAlign: 'center' }}>{t('verification_complete_your_identity')}</Typo>

				<Spacer size="20px" />
			</VBox>

			{/* Liveness verification informer */}
			{capturedImage && (
				<Informer
					state={informerState}
					errorMessage={checkError || undefined}
					onContinue={handleInformerContinue}
					onCancel={informerState === 'success' ? undefined : handleCancel}
					timeout={5}
					isLiveness
				/>
			)}

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
		</Box>
	);
};

const blinkAnimation = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BlinkingBox = styled.div<{ $animating?: boolean }>`
	animation: ${(props) => (props.$animating ? blinkAnimation : 'none')};
	animation-duration: 1s;
	animation-iteration-count: infinite;
`;
