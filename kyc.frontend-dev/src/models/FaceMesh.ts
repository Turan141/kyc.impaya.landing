import { action, atom, batch, Ctx } from '@reatom/framework';
import { createDetector, Face, FaceLandmarksDetector, SupportedModels } from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';

import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow-models/face-detection';
import { canvasSrcAtom, ctxSrcAtom, videoAtom } from './Camera';
import { sessionIDAtom } from './Session';
import { ensureBackend } from 'src/utils/tensorflowBackend';
import { calculateImgResize } from 'src/utils/canvasHelpers';

const OFFSET_TOP = 135;
const OFFSET_BOTTOM = 110;

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Acceptable size ratios to detection face in the oval
const MIN_RATIO = 0.3;
const MAX_RATIO = 0.75;
const MIN_RATIO_SELFIE = isMobile() ? 0.3 : 0.3;
const MAX_RATIO_SELFIE = isMobile() ? 0.4 : 0.5;

const YAW_MAX = 110;
const YAW_MIN = 70;

// Atoms
export const FMDetectorAtom = atom<FaceLandmarksDetector | null>(null, 'FMDetector');
export const canvasDstAtom = atom<HTMLCanvasElement | null>(null, 'canvasDst');
export const ctxDstAtom = atom<CanvasRenderingContext2D | null>(null, 'ctxDst');
export const fmSuggestionAtom = atom<string | null>(null, 'fmSuggestion');

let isResizing = false;

export const loadingFMAtom = atom<boolean>(false, 'loadingFM');
export const isInitializedAtom = atom<boolean>(false, 'isInitialized');
export const fmErrorAtom = atom<string | null>(null, 'fmError');
export const yawHistoryAtom = atom<number[]>([], 'yawHistory');
export const livenessDetectedAtom = atom<boolean>(false, 'livenessDetected');

const drawingFrameAtom = atom<boolean>(false, 'drawingFrame');
const detectionTimeAtom = atom<number>(-1, 'detectionTime');

// Actions
export const initFaceMesh = action(async (ctx) => {
	const isInitialized = ctx.get(isInitializedAtom);
	const FMDetector = ctx.get(FMDetectorAtom);
	if (isInitialized && FMDetector) {
		return;
	}

	resetFM(ctx);

	batch(ctx, () => {
		loadingFMAtom(ctx, true);
		isInitializedAtom(ctx, false);
		fmErrorAtom(ctx, null);
	});

	try {
		ctx.schedule(async () => {
			await tf.ready();
			await ensureBackend();
		});

		const FMDetector = await createDetector(SupportedModels.MediaPipeFaceMesh, {
			runtime: 'tfjs',
			refineLandmarks: false,
			maxFaces: 1,
		});

		FMDetectorAtom(ctx, FMDetector);
		isInitializedAtom(ctx, true);
	} catch (err) {
		if (!isError(err)) return;

		console.error('[FaceMesh] Error on loading:', err);
		fmErrorAtom(ctx, `Error on initializing FaceMesh: ${err.message}`);
	} finally {
		loadingFMAtom(ctx, false);
	}
}, 'initFaceMesh');

export const clearLiveness = action((ctx) => {
	yawHistoryAtom(ctx, []);
	fmSuggestionAtom(ctx, null);
}, 'clearLiveness');

export const drawFrame = action(async (ctx) => {
	const FMDetector = ctx.get(FMDetectorAtom);
	if (!FMDetector) {
		if (!ctx.get(loadingFMAtom)) {
			initFaceMesh(ctx);
		}
	}
	const video = ctx.get(videoAtom);
	if (!video) {
		return;
	}
	if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
		return;
	}
	if (ctx.get(drawingFrameAtom)) {
		return;
	}
	const canvasDst = ctx.get(canvasDstAtom);
	if (!canvasDst) {
		return;
	}
	const ctxDst = ctx.get(ctxDstAtom);
	if (!ctxDst) {
		return;
	}

	const canvasSrc = ctx.get(canvasSrcAtom);
	if (!canvasSrc) {
		return;
	}

	const ctxSrc = ctx.get(ctxSrcAtom);
	if (!ctxSrc) {
		return;
	}

	drawingFrameAtom(ctx, true);
	try {
		const { sx, sy, sw, sh, dx, dy, dw, dh } = calculateImgResize(video.videoWidth, video.videoHeight, canvasSrc);
		ctxSrc.clearRect(0, 0, canvasSrc.width, canvasSrc.height);
		ctxSrc.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);

		let facePosition: FaceDetectionResult = { status: false, suggestion: 'no_face_detected' };
		let face;
		if (!isResizing) {
			face = FMDetector
				? (
						await ctx.schedule(
							async () => await FMDetector.estimateFaces(canvasSrc as HTMLCanvasElement, { flipHorizontal: true }),
						)
					)[0]
				: null;

			const isSelfie = !!ctx.get(sessionIDAtom);
			// Check if face is in oval and draw the oval
			facePosition = checkFaceInOval(face ?? null, ctxSrc, isSelfie);
			fmSuggestionAtom(ctx, facePosition.suggestion);
			drawOval(ctxSrc, facePosition.status);
			if (isSelfie) drawFaceMask(ctxSrc, face);
		} else {
			drawOval(ctxSrc, false);
		}

		// Draw video with face mask on the target canvas (dimentions are for the UI)
		drawOnCanvasDst(canvasSrc, ctxDst);

		if (!facePosition.status) {
			detectionTimeAtom(ctx, -1);
			return;
		}

		const detectionTime = ctx.get(detectionTimeAtom);
		// For selfie - check if face is stable for some time
		if (detectionTime === -1) {
			detectionTimeAtom(ctx, Date.now());
		} else if (Date.now() - detectionTime > 1000) {
			// Face has been in frame for 1 second
			fmSuggestionAtom(ctx, 'Good job! Slowly turn your head left and right');
		} else {
			fmSuggestionAtom(ctx, 'Hold still for a moment');
		}

		if (!isResizing) {
			// Check liveness if face is in oval
			const liveness = checkLiveness(ctx, face?.keypoints);
			if (!liveness) return;
			batch(ctx, () => {
				livenessDetectedAtom(ctx, true);
				yawHistoryAtom(ctx, []);
			});

			setTimeout(() => livenessDetectedAtom(ctx, false), 300);
		}
	} catch (err) {
		if (!isError(err)) return;

		console.error('[FaceMesh] Error on drawing frame:', err);
	} finally {
		drawingFrameAtom(ctx, false);
	}
}, 'drawFrame');

export const resetFM = action((ctx) => {
	const FMDetector = ctx.get(FMDetectorAtom);
	try {
		if (FMDetector) {
			FMDetector.dispose();
		}
	} catch (e) {
		console.error('[FaceMesh] Error on disposing:', e);
	} finally {
		FMDetectorAtom(ctx, null);
	}
}, 'resetFaceMesh');

const drawOval = (ctxDst: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, isFaceInFrame: boolean) => {
	if (!ctxDst) return;

	const { x, y, radiusX, radiusY } = calculateEllipse(ctxDst.canvas);

	// Draw semi-transparent overlay
	ctxDst.fillStyle = 'rgba(0, 0, 0, 0.5)';

	// Create oval cutout
	ctxDst.beginPath();
	ctxDst.rect(0, 0, ctxDst.canvas.width, ctxDst.canvas.height);
	ctxDst.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
	ctxDst.fill('evenodd');

	// Draw oval border - color changes when face detected in oval
	ctxDst.beginPath();
	ctxDst.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
	ctxDst.lineWidth = 3;
	ctxDst.strokeStyle = isFaceInFrame ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
	ctxDst.stroke();
};

const checkFaceInOval = (
	face: Face | null,
	ctxCanvas: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
	isSelfie: boolean,
): FaceDetectionResult => {
	const box = face?.box;
	if (!box) {
		return { status: false, suggestion: 'no_face_detected' };
	}

	const { x, y, radiusX, radiusY } = calculateEllipse(ctxCanvas.canvas);
	const { xMin, yMin, xMax, yMax, width, height } = box;

	// Define oval as percentage of canvas
	const PADDING = 20;
	const ovalXMin = x - radiusX - (isSelfie ? 0 : PADDING);
	const ovalYMin = y - radiusY - (isSelfie ? 0 : PADDING);
	const ovalWidth = radiusX * 2 + (isSelfie ? 0 : PADDING * 2);
	const ovalHeight = radiusY * 2 + (isSelfie ? 0 : PADDING * 2);
	const ovalXMax = ovalXMin + ovalWidth;
	const ovalYMax = ovalYMin + ovalHeight;

	// Check if face rectangle is inside oval rectangle
	const isInside = xMin >= ovalXMin && yMin >= ovalYMin && xMax <= ovalXMax && yMax <= ovalYMax;

	// Calculate face area ratio to oval area
	const faceArea = width * height;
	const ovalArea = ovalWidth * ovalHeight;
	const ratio = faceArea / ovalArea;

	// Draw rectangles for debugging
	// if (ctxCanvas) {
	// 	ctxCanvas.strokeStyle = isInside ? 'rgba(255, 255, 255, 0.7)' : 'red';
	// 	ctxCanvas.strokeRect(ovalXMin, ovalYMin, ovalWidth, ovalHeight);
	// 	ctxCanvas.strokeStyle = 'green';
	// 	ctxCanvas.strokeRect(xMin, yMin, width, height);
	// }

	const minRatio = isSelfie ? MIN_RATIO_SELFIE : MIN_RATIO;
	const maxRatio = isSelfie ? MAX_RATIO_SELFIE : MAX_RATIO;

	const yaw = getYaw(face.keypoints);

	// Generate suggestion based on position
	let suggestion = '';
	if (!isInside) {
		suggestion = 'fit_face_into_oval';
	} else if (ratio < minRatio) {
		suggestion = 'move_closer';
	} else if (ratio > maxRatio) {
		suggestion = 'move_further';
	} else if (isSelfie && yaw > YAW_MAX) {
		suggestion = 'turn_left';
	} else if (isSelfie && yaw < YAW_MIN) {
		suggestion = 'turn_right';
	} else {
		suggestion = 'good';
	}

	const isCorrect = isInside && ratio >= minRatio && ratio <= maxRatio && (isSelfie ? yaw >= YAW_MIN && yaw <= YAW_MAX : true);

	return {
		status: isCorrect,
		suggestion,
		count: 1,
	};
};

const FACE_OVAL_INDEXES = [
	10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93,
	234, 127, 162, 21, 54, 103, 67, 109,
];

const drawFaceMask = (ctxDst: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, face: Face | null) => {
	if (!(ctxDst && face)) return;

	// draw face oval by dots
	let isFirst = false;
	ctxDst.beginPath();
	FACE_OVAL_INDEXES.forEach((idx) => {
		if (!isFirst) {
			isFirst = true;
			ctxDst.moveTo(face.keypoints[idx].x, face.keypoints[idx].y);
			return;
		}
		ctxDst.lineTo(face.keypoints[idx].x, face.keypoints[idx].y);
	});

	ctxDst.closePath();
	ctxDst.lineWidth = 1;
	ctxDst.strokeStyle = 'rgba(255, 255, 255, 0.3)';
	ctxDst.stroke();
};

const drawOnCanvasDst = (canvasSrc: HTMLCanvasElement | OffscreenCanvas, ctxDst: CanvasRenderingContext2D) => {
	if (!(canvasSrc && ctxDst)) {
		return;
	}

	ctxDst.save();
	// ctxDst.clearRect(0, 0, canvasDst.width, canvasDst.height);
	ctxDst.drawImage(canvasSrc, 0, 0);
	ctxDst.restore();
};

function calculateEllipse(canvas: HTMLCanvasElement | OffscreenCanvas) {
	if (!canvas) return { x: 0, y: 0, radiusX: 0, radiusY: 0 };

	const offsetY = OFFSET_TOP;
	const ovalWidth = Math.min(canvas.width - 50, 420);
	const ovalHeight = Math.min(ovalWidth * 1.3, canvas.height - OFFSET_TOP - OFFSET_BOTTOM);

	return {
		x: canvas.width / 2,
		y: Math.max(offsetY + ovalHeight / 2 + 5, canvas.height / 2),
		radiusX: ovalWidth / 2,
		radiusY: ovalHeight / 2,
	};
}

// Check liveness based on head movement
function checkLiveness(ctx: Ctx, keypoints?: Face['keypoints']) {
	if (!keypoints) {
		return false;
	}
	// Calculate yaw (head rotation left-right)
	const yaw = getYaw(keypoints);

	// Add to history and keep only last 10 values
	yawHistoryAtom(ctx, (prev) => {
		const newHistory = [...prev, yaw];
		if (newHistory.length > 10) {
			newHistory.shift();
		}
		return newHistory;
	});
	const yawHistory = ctx.get(yawHistoryAtom);

	// Calculate max yaw difference in history
	const yawDiff = Math.max(...yawHistory) - Math.min(...yawHistory);

	// Require minimum yaw difference to detect liveness
	return yawDiff > 6;
}

function getYaw(keypoints: Face['keypoints']) {
	const rightEye = keypoints[33];
	const leftEye = keypoints[263];
	const nose = keypoints[1];

	const eyeCenterX = (leftEye.x + rightEye.x) / 2;
	const eyeCenterY = (leftEye.y + rightEye.y) / 2;
	const dx = nose.x - eyeCenterX;
	const dy = nose.y - eyeCenterY;
	return Math.atan2(dy, dx) * (180 / Math.PI);
}

function isError(value: unknown): value is Error {
	return value instanceof Error && !!value.name && !!value.message;
}

canvasDstAtom.onChange((ctx, canvasEl) => {
	if (!canvasEl) {
		ctxDstAtom(ctx, null);
		return;
	}
	ctxDstAtom(ctx, canvasEl.getContext('2d'));
});

interface FaceDetectionResult {
	status: boolean;
	suggestion: string;
	count?: number;
}

let id: NodeJS.Timeout;
window.addEventListener('resize', () => {
	isResizing = true;
	clearTimeout(id);
	id = setTimeout(() => {
		isResizing = false;
	}, 100);
});
