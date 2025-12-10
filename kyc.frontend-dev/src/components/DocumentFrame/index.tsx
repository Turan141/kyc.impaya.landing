import { useDialog } from '@contexts/DialogContext';
import { useSession } from '@contexts/SessionContext';
import { useAction, useAtom } from '@reatom/npm-react';
import { Box, VBox } from '@ui/box/Box';
import Button from '@ui/button/Button';
import { IconClose } from '@ui/icons';
import Spacer from '@ui/spacer/Spacer';
import { Spinner } from '@ui/spinner/Spinner';
import { Typo } from '@ui/text/Typo';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	cameraModeAtom,
	documentDetectionErrorsCountAtom,
	documentDetectionModeAtom,
	isLoadingAtom,
	releaseCameraAction,
	streamAtom,
	streamErrorAtom,
	takePhotoAction,
	takeDocumentFramePhotoAction,
	videoAtom,
} from 'src/models/Camera';
import { canvasDstAtom } from 'src/models/FaceMesh';
import { detectDocument } from 'src/services/api';
import { AppPage } from '../../App';
import { Informer, InformerState } from '../Informer';

interface DocumentCameraComponentProps {
	onNavigate: (page: AppPage) => void;
}

const AUTO_DETECT_INTERVAL = 2000;

export const DocumentCameraComponent = ({ onNavigate }: DocumentCameraComponentProps) => {
	const { t } = useTranslation();
	const { showDialog } = useDialog();

	const [videoRef, setVideoRef] = useAtom(videoAtom);
	const [cameraMode, setCameraMode] = useAtom(cameraModeAtom);
	const [cameraLoading] = useAtom(isLoadingAtom);
	const [cameraError] = useAtom(streamErrorAtom);
	const cameraPermission = !!useAtom(streamAtom)[0];
	const [canvas, setCanvas] = useAtom(canvasDstAtom);
	const [detectionMode, setDetectionMode] = useAtom(documentDetectionModeAtom);

	const [documentDetectionErrorsCount, setDocumentDetectionErrorsCount] = useAtom(documentDetectionErrorsCountAtom);

	const takePhoto = useAction(takePhotoAction);
	const takeDocumentFramePhoto = useAction(takeDocumentFramePhotoAction);
	const releaseCamera = useAction(releaseCameraAction);

	const {
		sessionId,
		clearError,
		error: sessionError,
		documentVerified,
		verifyDocument,
		requiredSteps,
		currentStep,
		setCurrentStep,
	} = useSession();

	// States
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [informerState, setInformerState] = useState<InformerState>('busy');
	const [needsFlip, setNeedsFlip] = useState(false);
	const [detectingDocument, setDetectingDocument] = useState(false);
	const [processingDocument, setProcessingDocument] = useState(false);
	const [checkError, setCheckError] = useState('');
	const previousCapturedImage = useRef<string | null>(null);
	const wrapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const hadRetry = !capturedImage && previousCapturedImage.current;

		if (hadRetry && cameraMode === 'document-flip') {
			if (videoRef) {
				setTimeout(() => {
					if (videoRef) {
						const stream = videoRef.srcObject as MediaStream;
						if (stream) {
							const tracks = stream.getVideoTracks();
							if (tracks.length > 0) {
								tracks[0].enabled = false;
								setTimeout(() => {
									tracks[0].enabled = true;
								}, 10);
							}
						}
					}
				}, 50);
			}
		}

		previousCapturedImage.current = capturedImage;
	}, [capturedImage, cameraMode, videoRef]);

	// Draw document frame
	useEffect(() => {
		// Draw the frame
		const drawFrame = () => {
			const video = videoRef;
			if (!canvas || !video) return;

			// Set canvas size to match video
			const bounds = video.getBoundingClientRect();
			canvas.width = video.videoWidth || bounds.width;
			canvas.height = video.videoHeight || bounds.height;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Clear canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw semi-transparent overlay
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Create cutout for document
			ctx.globalCompositeOperation = 'destination-out';
			ctx.beginPath();
			ctx.rect(0, canvas.height / 4, canvas.width, canvas.height / 2);
			ctx.fill();

			// Draw border around cutout
			ctx.globalCompositeOperation = 'source-over';
			ctx.beginPath();
			ctx.rect(0, canvas.height / 4, canvas.width, canvas.height / 2);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
			ctx.stroke();
		};

		// Call on resize and video load
		drawFrame();

		const video = videoRef;
		if (!video) return;

		// Create resize observer
		const resizeObserver = new ResizeObserver(drawFrame);
		resizeObserver.observe(document.body);

		// Listen for video events
		video.addEventListener('loadedmetadata', drawFrame);
		video.addEventListener('resize', drawFrame);

		return () => {
			resizeObserver.disconnect();
			video.removeEventListener('loadedmetadata', drawFrame);
			video.removeEventListener('resize', drawFrame);
		};
	}, [videoRef, canvas]);

	// Process document verification
	const processDocument = useCallback(
		async (photo: string) => {
			if (!sessionId) return;

			setInformerState('busy');
			setProcessingDocument(true);

			try {
				// Check if we need to use flip parameter
				const isFlip = cameraMode === 'document-flip';

				// Call API to verify document
				const result = await verifyDocument(photo, isFlip ? 1 : 0);
				// Process response
				if (result.code === 106) {
					setInformerState('error');
					setCheckError(result.details);
				} else if (result.status === 'flip') {
					setNeedsFlip(true);
					setInformerState('success');
				} else {
					setInformerState('success');
				}
			} catch (err) {
				console.error('Document verification error:', err);
				setInformerState('error');
			} finally {
				setProcessingDocument(false);
			}
		},
		[cameraMode, sessionId, verifyDocument],
	);

	useEffect(() => {
		if (detectionMode !== 'auto') return;
		if (capturedImage) return;
		if (documentDetectionErrorsCount > 10) {
			setDetectionMode('manual');
			return;
		}

		const interval = setInterval(async () => {
			if (cameraLoading) return;
			if (detectingDocument) return;
			if (documentDetectionErrorsCount > 10) {
				clearInterval(interval);
				setDetectionMode('manual');
				return;
			}
			setDetectingDocument(true);
			const croppedPhoto = await takeDocumentFramePhoto();
			if (croppedPhoto) {
				const { hasDocument } = await detectDocument(sessionId, croppedPhoto);
				if (hasDocument) {
					clearInterval(interval);
					setCapturedImage(croppedPhoto);
					processDocument(croppedPhoto);
					setDetectingDocument(false);
					return;
				}
			}
			setDetectingDocument(false);
		}, AUTO_DETECT_INTERVAL);
		return () => clearInterval(interval);
	}, [
		cameraLoading,
		takePhoto,
		takeDocumentFramePhoto,
		sessionId,
		detectionMode,
		documentDetectionErrorsCount,
		setDocumentDetectionErrorsCount,
		setDetectionMode,
		processDocument,
		capturedImage,
		detectingDocument,
	]);

	// Take photo
	const handleTakePhoto = useCallback(async () => {
		clearError();
		const photo = await takePhoto();
		if (photo) {
			setCapturedImage(photo);
			processDocument(photo);
		}
	}, [takePhoto, processDocument, clearError]);

	// Handle continue from informer
	const handleInformerContinue = useCallback(
		(retake: boolean) => {
			if (retake) {
				setCapturedImage(null);
				return;
			}

			if (needsFlip && cameraMode === 'document') {
				setCameraMode('document-flip');
				setNeedsFlip(false);
				setCapturedImage(null);
				return;
			}

			if (documentVerified) {
				const currentIndex = requiredSteps.indexOf(currentStep!);
				const nextStep = requiredSteps[currentIndex + 1] || null;

				if (nextStep) {
					setCurrentStep(nextStep);
					if (nextStep !== 'liveness') {
						setCapturedImage(null);
					}
				} else {
					onNavigate('result');
				}
				return;
			}

			setCapturedImage(null);
		},
		[cameraMode, currentStep, documentVerified, needsFlip, onNavigate, requiredSteps, setCameraMode, setCurrentStep],
	);

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

	// UI titles
	const title = cameraMode === 'document-flip' ? t('take_photo_of_the_back_side') : t('take_photo_of_documemt');

	const subtitle = t('make_sure_all_details_are_clearly_visible');

	return (
		<Box
			ref={wrapRef}
			sx={{
				position: 'relative',
				overflow: 'hidden',
				width: '100%',
				backgroundColor: 'black',
				flexGrow: 1,
			}}
		>
			{/* Video */}
			<video
				ref={setVideoRef}
				autoPlay
				muted
				playsInline
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
			/>

			{/* Document frame canvas */}
			<canvas
				ref={setCanvas}
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					pointerEvents: 'none',
				}}
			/>

			{/* UI Overlay */}
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
				<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{title}</Typo>

				<Spacer size="10px" />

				{/* Subtitle */}
				<Typo sx={{ fontSize: '16px', textAlign: 'center' }}>{subtitle}</Typo>

				{/* Camera error */}
				{cameraError && (
					<>
						<Spacer size="10px" />
						<Typo sx={{ fontSize: '16px', textAlign: 'center', color: 'red' }}>{cameraError}</Typo>
					</>
				)}

				<Spacer grow />

				{/* Take photo button - shown only in manual mode */}
				{detectionMode === 'manual' && (
					<Button
						sx={{
							color: 'rgb(20, 23, 31)',
							backgroundColor: 'rgba(255, 255, 255, 0.8)',
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore: hover is valid selector
							'&:hover': {
								opacity: '0.8',
							},
							'&:active': {
								opacity: '0.6',
							},
							width: '100%',
							padding: '12px',
						}}
						onClick={handleTakePhoto}
						disabled={cameraLoading || processingDocument || !cameraPermission}
					>
						{cameraPermission ? t('take_photo') : t('no_camera_permission')}
					</Button>
				)}

				<Spacer size="20px" />
			</VBox>

			{/* Document verification informer */}
			{capturedImage && (
				<Informer
					state={informerState}
					errorMessage={sessionError || checkError}
					needsFlip={needsFlip}
					onContinue={handleInformerContinue}
					onCancel={informerState === 'success' ? undefined : handleCancel}
					timeout={10}
				/>
			)}

			{/* Loading spinner */}
			{cameraLoading && (
				<Box
					sx={{
						position: 'absolute',
						top: '0px',
						left: '0px',
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
