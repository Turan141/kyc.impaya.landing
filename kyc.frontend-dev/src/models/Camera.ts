import { action, atom, batch } from '@reatom/framework';
import { clearLiveness, initFaceMesh, resetFM } from './FaceMesh';
import { DEFAULT_AVATAR_HEIGHT, DEFAULT_AVATAR_WIDTH } from 'src/utils';
import { calculateImgResize } from 'src/utils/canvasHelpers';

export type CameraMode = 'document' | 'document-flip' | 'liveness' | 'utility' | 'selfie' | null;
export type FacingMode = 'user' | 'environment';
export type DocumentDetectionMode = 'manual' | 'auto';

// Atoms
export const videoAtom = atom<HTMLVideoElement | null>(null, 'videoRef');
export const streamAtom = atom<MediaStream | null>(null, 'stream');
export const isStreamActiveAtom = atom<boolean>(false, 'isStreamActive');
export const isLoadingAtom = atom<boolean>(false, 'isLoading');

export const cameraModeAtom = atom<CameraMode>(null, 'cameraMode');
export const facingModeAtom = atom<FacingMode>('environment', 'facingMode');
export const documentDetectionModeAtom = atom<DocumentDetectionMode>('auto', 'documentDetectionMode');
export const documentDetectionErrorsCountAtom = atom<number>(0, 'documentDetectionErrorsCount');

export const canvasSrcAtom = atom<HTMLCanvasElement | OffscreenCanvas | null>(null, 'canvasSrc');
export const ctxSrcAtom = atom<CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null>(null, 'ctxSrc');

export const streamErrorAtom = atom<string | null>(null, 'cameraError');

// Actions
export const initStreamAction = action(async (ctx, mode: FacingMode = 'environment') => {
	batch(ctx, () => {
		isLoadingAtom(ctx, true);
		streamErrorAtom(ctx, null);
	});
	try {
		if (!navigator.mediaDevices || !('getUserMedia' in navigator.mediaDevices)) {
			throw new Error('getUserMedia not supported');
		}

		clearStream(ctx);
		flushVideoSrc(ctx);

		const stream = await ctx.schedule(async () => await navigator.mediaDevices.getUserMedia(getConstraints(mode)));
		streamAtom(ctx, stream);
		linkStreamToVideoAction(ctx, stream);
	} catch (err) {
		if (!isError(err)) return;

		console.error('[Camera] Error on initializing stream:', err);
		if (err.name === 'NotAllowedError') {
			streamErrorAtom(ctx, 'Camera access denied. Please grant permission in browser settings.');
		} else if (err.name === 'NotFoundError') {
			streamErrorAtom(ctx, 'No camera found. Make sure a camera is connected.');
		} else if (err.message === 'getUserMedia not supported') {
			streamErrorAtom(ctx, 'Your browser does not support camera access.');
		} else {
			streamErrorAtom(ctx, `Error starting camera: ${err.message}`);
		}

		batch(ctx, () => {
			isStreamActiveAtom(ctx, false);
			isLoadingAtom(ctx, false);
		});
	}
}, 'initStream');

export const switchCameraMode = action(async (ctx, mode: CameraMode) => {
	if (ctx.get(cameraModeAtom) === mode) return;
	cameraModeAtom(ctx, mode);

	clearStream(ctx);
	flushVideoSrc(ctx);

	if (!mode) return;

	const newFacingMode: FacingMode = mode === 'document' || mode === 'document-flip' ? 'environment' : 'user';
	facingModeAtom(ctx, newFacingMode);

	await ctx.schedule(async () => await initStreamAction(ctx, newFacingMode));

	if (ctx.get(cameraModeAtom) === 'liveness' || ctx.get(cameraModeAtom) === 'selfie') {
		await ctx.schedule(async () => await initFaceMesh(ctx));
	}
}, 'switchCameraMode');

export const releaseCameraAction = action(async (ctx) => {
	resetFM(ctx);
	clearLiveness(ctx);
	clearStream(ctx, true);
	flushVideoSrc(ctx);
	cameraModeAtom(ctx, null);
	await ctx.schedule(async () => await new Promise((resolve) => setTimeout(resolve, 500)));
}, 'releaseCamera');

export const linkStreamToVideoAction = action(async (ctx, stream: MediaStream) => {
	const video = ctx.get(videoAtom);
	if (!video) return;

	video.srcObject = stream;
	video.onerror = () => {
		streamErrorAtom(ctx, 'Error accessing camera stream.');
	};

	if (video.readyState >= 2) {
		await ctx.schedule(async () => await video.play());
		return;
	}

	const onLoadedMetadata = async () => {
		const video = ctx.get(videoAtom);
		if (!video) return;

		video.removeEventListener('loadedmetadata', onLoadedMetadata);

		await ctx.schedule(async () => await video.play());

		const isOffscreen = typeof OffscreenCanvas !== 'undefined' && typeof Worker !== 'undefined';

		const canvasSrcEl = isOffscreen ? new OffscreenCanvas(0, 0) : document.createElement('canvas');
		canvasSrcAtom(ctx, canvasSrcEl);
		ctxSrcAtom(ctx, canvasSrcEl.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D);

		batch(ctx, () => {
			isStreamActiveAtom(ctx, true);
			isLoadingAtom(ctx, false);
		});
	};

	video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
}, 'linkStreamToVideo');

const clearStream = action((ctx, flushAtom: boolean = true) => {
	const stream = ctx.get(streamAtom);
	if (!stream) return;

	stream.getTracks().forEach((track) => {
		track.stop();
	});
	if (flushAtom) streamAtom(ctx, null);
}, 'clearStream');

// Take a photo from current video stream
export const takePhotoAction = action(async (ctx, needCropSelfie: boolean = false): Promise<string | null> => {
	const videoRef = ctx.get(videoAtom);
	const facingMode = ctx.get(facingModeAtom);

	if (!videoRef) return null;

	// Create canvas same size as video
	const canvas = document.createElement('canvas');
	canvas.width = needCropSelfie ? DEFAULT_AVATAR_WIDTH : videoRef.videoWidth;
	canvas.height = needCropSelfie ? DEFAULT_AVATAR_HEIGHT : videoRef.videoHeight;

	const ctxPhoto = canvas.getContext('2d');
	if (!ctxPhoto) return null;

	ctxPhoto.imageSmoothingEnabled = true;
	ctxPhoto.imageSmoothingQuality = 'high';

	// Mirror for front camera
	if (facingMode === 'user') {
		ctxPhoto.translate(canvas.width, 0);
		ctxPhoto.scale(-1, 1);
	}

	// Draw video frame to canvas
	if (needCropSelfie) {
		const scale = Math.max(canvas.width / videoRef.videoWidth, canvas.height / videoRef.videoHeight);
		const scaledWidth = videoRef.videoWidth * scale;
		const scaledHeight = videoRef.videoHeight * scale;

		// Center the image
		const dx = (canvas.width - scaledWidth) / 2;
		const dy = (canvas.height - scaledHeight) / 2;

		ctxPhoto.drawImage(videoRef, dx, dy, scaledWidth, scaledHeight);
	} else {
		ctxPhoto.drawImage(videoRef, 0, 0);
	}
	return canvas.toDataURL('image/jpeg');
});

// Take a photo cropped to document frame area (visible transparent area)
export const takeDocumentFramePhotoAction = action(async (ctxReatom): Promise<string | null> => {
	const videoRef = ctxReatom.get(videoAtom);
	if (!videoRef) return null;

	const bounds = videoRef.getBoundingClientRect();
	const containerWidth = bounds.width;
	const containerHeight = bounds.height;

	// Create temporary canvas to calculate visible area
	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = containerWidth;
	tempCanvas.height = containerHeight;

	// Calculate which part of full video is visible (accounting for object-fit: cover)
	const resize = calculateImgResize(videoRef.videoWidth, videoRef.videoHeight, tempCanvas);

	// Document frame is center half by height of visible area
	// In full video coordinates:
	let frameX = resize.sx;
	let frameY = resize.sy + resize.sh / 4;
	let frameWidth = resize.sw;
	let frameHeight = resize.sh / 2;

	// Ensure minimum size of 640x640
	const minSize = 640;
	if (frameWidth < minSize) {
		const expandWidth = minSize - frameWidth;
		frameX = Math.max(0, frameX - expandWidth / 2);
		frameWidth = Math.min(minSize, videoRef.videoWidth - frameX);
	}
	if (frameHeight < minSize) {
		const expandHeight = minSize - frameHeight;
		frameY = Math.max(0, frameY - expandHeight / 2);
		frameHeight = Math.min(minSize, videoRef.videoHeight - frameY);
	}

	// Create output canvas exactly 640x640
	const canvas = document.createElement('canvas');
	canvas.width = minSize;
	canvas.height = minSize;

	const ctx = canvas.getContext('2d');
	if (!ctx) return null;

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = 'high';

	// Draw cropped portion from video, scaled to 640x640
	ctx.drawImage(
		videoRef,
		frameX,
		frameY,
		frameWidth,
		frameHeight, // Source
		0,
		0,
		minSize,
		minSize, // Destination
	);

	return canvas.toDataURL('image/jpeg');
});

const flushVideoSrc = action((ctx) => {
	const video = ctx.get(videoAtom);
	if (video) {
		video.srcObject = null;
	}
	videoAtom(ctx, null);
}, 'flushVideoSrc');

function getConstraints(facingMode: FacingMode): MediaStreamConstraints {
	return {
		video: {
			facingMode,
			width: { ideal: 1280, min: 640 },
			height: { ideal: 720, min: 480 },
			frameRate: { ideal: 30, min: 15 },
		},
	};
}

function isError(value: unknown): value is Error {
	return value instanceof Error && !!value.name && !!value.message;
}
