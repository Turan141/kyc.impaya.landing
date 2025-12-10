/*
 * !!!IMPORTANT!!!
 *
 * The same conde is used in Common module and result should be the same.
 * If you change it, please change it in Common module as well.
 *
 */

import { getSha256 } from './sha256';

class BrowserFingerprint {
	private data: Partial<FingerprintData> = {};

	async generate(): Promise<string> {
		await this.collectData();
		const hash = await getSha256(JSON.stringify(this.data));
		return hash;
	}

	async getData(): Promise<Partial<FingerprintData>> {
		await this.collectData();
		return this.data;
	}

	private async collectData(): Promise<void> {
		const nav = window.navigator as NavigatorWithUserAgentData;

		this.data = {
			userAgent: window.navigator.userAgent,
			languages: window.navigator.languages,
			platform: this.getPlatform(),
			userAgentData: await this.getUserAgentData(),
			hardwareConcurrency: window.navigator.hardwareConcurrency,
			deviceMemory: nav.deviceMemory,
			screenResolution: `${window.screen.width}x${window.screen.height}`,
			colorDepth: window.screen.colorDepth,
			pixelRatio: window.devicePixelRatio,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			timezoneOffset: new Date().getTimezoneOffset(),
			sessionStorage: this.testStorage('sessionStorage'),
			localStorage: this.testStorage('localStorage'),
			indexedDB: !!window.indexedDB,
			cookiesEnabled: window.navigator.cookieEnabled,
			doNotTrack: window.navigator.doNotTrack || null,
			touchSupport: {
				maxTouchPoints: window.navigator.maxTouchPoints || 0,
				touchEvent: 'ontouchstart' in window,
				touchStart: 'ontouchstart' in window,
			},
		};
	}

	private testStorage(type: 'localStorage' | 'sessionStorage'): boolean {
		try {
			const storage = window[type];
			const test = '__storage_test__';
			storage.setItem(test, test);
			storage.removeItem(test);
			return true;
		} catch (e) {
			console.error(`[Fingerprint] Error testing ${type} storage:`, e);
			return false;
		}
	}

	private getPlatform(): string {
		// Use User-Agent Client Hints API if available, fallback to deprecated platform
		const nav = window.navigator as NavigatorWithUserAgentData;
		if (nav.userAgentData?.platform) {
			return nav.userAgentData.platform;
		}
		// Fallback to deprecated API
		return window.navigator.platform || '';
	}

	private async getUserAgentData(): Promise<UserAgentData | null> {
		try {
			const nav = window.navigator as NavigatorWithUserAgentData;
			const uaData = nav.userAgentData;
			if (!uaData) return null;

			// Get high entropy values if available
			if (uaData.getHighEntropyValues) {
				return await uaData.getHighEntropyValues([
					'architecture',
					'bitness',
					'brands',
					'mobile',
					'model',
					'platform',
					'platformVersion',
					'uaFullVersion',
				]);
			}

			// Return basic data if high entropy is not available
			return {
				brands: uaData.brands,
				mobile: uaData.mobile,
				platform: uaData.platform,
			};
		} catch (e) {
			console.error('[Fingerprint] Error getting user agent data:', e);
			return null;
		}
	}
}

export const createFingerprint = async (): Promise<string> => {
	const fp = new BrowserFingerprint();
	return await fp.generate();
};

export const getFingerprintData = async (): Promise<Partial<FingerprintData>> => {
	const fp = new BrowserFingerprint();
	return await fp.getData();
};

interface UserAgentData {
	brands?: { brand: string; version: string }[];
	mobile?: boolean;
	platform?: string;
	architecture?: string;
	bitness?: string;
	model?: string;
	platformVersion?: string;
	uaFullVersion?: string;
	getHighEntropyValues?: (hints: string[]) => Promise<UserAgentData>;
}

interface NavigatorWithUserAgentData extends Navigator {
	userAgentData?: UserAgentData;
	deviceMemory?: number;
}

interface FingerprintData {
	userAgent: string;
	languages: readonly string[];
	platform: string;
	userAgentData: UserAgentData | null;
	hardwareConcurrency: number;
	deviceMemory: number | undefined;
	screenResolution: string;
	colorDepth: number;
	pixelRatio: number;
	timezone: string;
	timezoneOffset: number;
	sessionStorage: boolean;
	localStorage: boolean;
	indexedDB: boolean;
	cookiesEnabled: boolean;
	doNotTrack: string | null;
	touchSupport: {
		maxTouchPoints: number;
		touchEvent: boolean;
		touchStart: boolean;
	};
}
