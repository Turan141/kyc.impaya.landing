/**
 * Canvas helper utilities for video and image manipulation
 */

interface ImgResizeResult {
	sw: number;
	sh: number;
	sx: number;
	sy: number;
	dx: number;
	dy: number;
	dw: number;
	dh: number;
	mode: 'v' | 'h' | null;
}

/**
 * Calculate proper crop and resize parameters to fit video into canvas
 * while maintaining aspect ratio and centering the image
 *
 * @param srcWidth - Source video/image width
 * @param srcHeight - Source video/image height
 * @param canvasDst - Destination canvas element
 * @returns Object with crop/resize parameters for drawImage
 */
export function calculateImgResize(
	srcWidth: number = 1,
	srcHeight: number = 1,
	canvasDst: HTMLCanvasElement | OffscreenCanvas,
): ImgResizeResult {
	if (!canvasDst) {
		return {
			sw: NaN,
			sh: NaN,
			sx: NaN,
			sy: NaN,
			dx: NaN,
			dy: NaN,
			dw: NaN,
			dh: NaN,
			mode: null,
		};
	}

	const srcAspectRatio = srcWidth / srcHeight;
	const dstAspectRatio = canvasDst.width / canvasDst.height;

	const dst = {
		dx: 0,
		dy: 0,
		dw: canvasDst.width,
		dh: canvasDst.height,
	};

	if (srcAspectRatio > dstAspectRatio) {
		// Video wider than target area, crop horizontally
		const sw = srcHeight * dstAspectRatio;
		return {
			sw,
			sh: srcHeight,
			sx: (srcWidth - sw) / 2, // Center horizontally
			sy: 0,
			mode: 'v',
			...dst,
		};
	}

	// Video taller than target area, crop vertically
	const sh = srcWidth / dstAspectRatio;
	return {
		sw: srcWidth,
		sh,
		sx: 0,
		sy: (srcHeight - sh) / 2, // Center vertically
		mode: 'h',
		...dst,
	};
}
