import { useEffect, useState } from 'react';

const checkMobile = () => screen.orientation !== undefined && screen.orientation.type.includes('portrait');

export const DEFAULT_AVATAR_WIDTH = 1024;
export const DEFAULT_AVATAR_HEIGHT = 1152;

export const useCheckMobileDevice = () => {
	const [isMobile, setIsMobile] = useState(checkMobile);

	useEffect(() => {
		const handleCheckMobile = () => setIsMobile(checkMobile);
		window.addEventListener('resize', handleCheckMobile);
		window.addEventListener('orientationchange', handleCheckMobile);
		return () => {
			window.removeEventListener('resize', handleCheckMobile);
			window.removeEventListener('orientationchange', handleCheckMobile);
		};
	}, []);

	return isMobile;
};

export const flipImage = (dataUrl: string): Promise<string> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.translate(img.width, 0);
				ctx.scale(-1, 1);
				ctx.drawImage(img, 0, 0);
			}
			resolve(canvas.toDataURL('image/jpeg'));
		};
		img.src = dataUrl;
	});
};

/*
 * Crops an image to a specific size to send avatar generation
 */
export function cropImage(imageSrc: string, targetWidth = DEFAULT_AVATAR_WIDTH, targetHeight = DEFAULT_AVATAR_HEIGHT): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = targetWidth;
			canvas.height = targetHeight;

			ctx!.fillStyle = '#FFFFFF';
			ctx!.fillRect(0, 0, targetWidth, targetHeight);

			// Calculate scale to fill the canvas (object-fit: cover)
			const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Center the image
			const dx = (targetWidth - scaledWidth) / 2;
			const dy = (targetHeight - scaledHeight) / 2;

			ctx!.drawImage(img, dx, dy, scaledWidth, scaledHeight);

			resolve(canvas.toDataURL('image/jpeg', 1));
		};
		img.onerror = reject;
		img.src = imageSrc;
	});
}

export function getProjectUrl(logoUrl?: string): string {
	if (!logoUrl) return '';

	if (logoUrl.includes('amazing.money')) {
		if (logoUrl.includes('demo')) return 'https://demo.amazing.money/';
		return 'https://amazing.money/';
	}

	if (logoUrl.includes('vibo.tips')) {
		if (logoUrl.includes('demo')) return 'https://demo.vibo.tips/';
		return 'https://vibo.tips/';
	}

	return '';
}

export function changeFavicon(url: string) {
	const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
	if (link) {
		link.href = url;
	} else {
		const newLink = document.createElement('link');
		newLink.rel = 'icon';
		newLink.href = url;
		document.head.appendChild(newLink);
	}
}
