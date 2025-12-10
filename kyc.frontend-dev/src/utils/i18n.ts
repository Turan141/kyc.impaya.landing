import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Signal, { Req } from 'badmfck-signal';
import { apiService } from 'src/services/api';

export const S_CURRENT_LANGUAGE = new Signal<string>('S_CURRENT_LANGUAGE');
export const S_LANGUAGE_LOADING = new Signal<boolean>('S_LANGUAGE_LOADING');
export const REQ_CHANGE_LANGUAGE = new Req<Languages['code'], void>(undefined, 'REQ_CHANGE_LANGUAGE');
export const SUPPORTED_LANGUAGES = [
	{ code: 'en', name: 'English' },
	{ code: 'fr', name: 'Français' },
	{ code: 'it', name: 'Italiano' },
	{ code: 'es', name: 'Spanish' },
	{ code: 'lv', name: 'Latviešu' },
	{ code: 'de', name: 'Deutsch' },
	{ code: 'ru', name: 'Русский' },
] as const;
export type Languages = (typeof SUPPORTED_LANGUAGES)[number];
export type Language = {
	code: Languages['code'];
	name: Languages['name'];
};
export const i18n = i18next;

const MAX_AGE = 7200; // 3 hours

class LanguageManager {
	private static instance: LanguageManager;
	private readonly CACHE_NAME = 'translations';
	private version: string;

	private log(message: string, isError: boolean = false): void {
		if (!import.meta.env.DEV) return;

		if (isError) {
			console.error('[LanguageManager]', message);
			return;
		}
		console.info('[LanguageManager]', message);
	}

	private constructor(version: string) {
		this.version = version;
	}
	public static getInstance(version: string): LanguageManager {
		if (!LanguageManager.instance) {
			LanguageManager.instance = new LanguageManager(version);
		}
		return LanguageManager.instance;
	}

	public async init(en: Record<string, string>): Promise<void> {
		this.log('Starting initialization');
		S_LANGUAGE_LOADING.invoke(true);

		this.clearOldCaches();

		const savedLang = (localStorage.getItem('language') || 'en') as Languages['code'];
		S_CURRENT_LANGUAGE.invoke(savedLang);

		await this.initializeI18n(savedLang, en);

		REQ_CHANGE_LANGUAGE.listener = async (lang) => {
			await this.changeLanguage(lang);
		};

		S_LANGUAGE_LOADING.invoke(false);
		this.log('Initialization complete');
	}

	private async initializeI18n(initialLang: Languages['code'], en: Record<string, string>) {
		await i18n.use(initReactI18next).init({
			resources: {
				en: { translation: en },
			},
			ns: ['translation'],
			defaultNS: 'translation',
			lng: initialLang,
			fallbackLng: 'en',
			interpolation: {
				escapeValue: false,
			},
			returnObjects: true,
			// returnNull: true, // remove after test
		});

		if (initialLang !== 'en') {
			await this.loadAndApplyTranslations(initialLang);
		}
	}

	private async changeLanguage(lang: Languages['code']): Promise<void> {
		this.log(`Changing language to ${lang}`);
		if (!SUPPORTED_LANGUAGES.some(({ code }) => code === lang)) {
			this.log(`Language ${lang} is not supported`, true);
			return;
		}

		try {
			S_LANGUAGE_LOADING.invoke(true);
			const result = await this.loadAndApplyTranslations(lang);
			if (!result.success) {
				// S_TOAST.invoke({
				// 	text: result.reason ?? 'Failed to change language',
				// 	type: 'error',
				// 	timer: 10000,
				// });
				throw new Error(result.reason ?? 'Failed to apply translations');
			}

			localStorage.setItem('language', lang);
			S_CURRENT_LANGUAGE.invoke(lang);
			this.log(`Language changed to ${lang}`);
		} catch (error) {
			this.log(`Failed to change language: ${error}`, true);
		} finally {
			S_LANGUAGE_LOADING.invoke(false);
		}
	}

	private async loadAndApplyTranslations(lang: Languages['code']): Promise<{ success: boolean; reason?: string }> {
		if (lang === 'en') {
			await i18n.changeLanguage(lang);
			return { success: true };
		}

		let translations;

		try {
			if (typeof caches !== 'undefined') {
				const cache = await caches.open(this.CACHE_NAME);
				const cacheKey = this.getCacheKey(lang);
				const cachedResponse = await cache.match(cacheKey);

				if (cachedResponse) {
					const cacheData = await cachedResponse.json();
					translations = cacheData;
					this.log(`Using cached translations for ${lang} (version ${this.version})`);
				}
			}

			if (!translations) {
				translations = await this.loadTranslations(lang);

				if (translations && typeof caches !== 'undefined') {
					const cache = await caches.open(this.CACHE_NAME);
					const cacheKey = this.getCacheKey(lang);
					const response = new Response(JSON.stringify(translations), {
						headers: { 'Cache-Control': `max-age=${MAX_AGE}` },
					});
					await cache.put(cacheKey, response);
					this.log(`Cached new translations for ${lang} (version ${this.version})`);
				}
			}

			if (translations) {
				i18n.addResourceBundle(lang, 'translation', translations, true, true);
				await i18n.changeLanguage(lang);
				this.log(`Applied translations for ${lang}`);
				return { success: true };
			}

			this.log(`No translations available for ${lang}, falling back to EN`, true);
			await i18n.changeLanguage('en');
			return {
				success: false,
				reason: `No translations available for ${
					SUPPORTED_LANGUAGES.find(({ code }) => code === lang)?.name
				}, falling back to English`,
			};
		} catch (error) {
			this.log(`Error applying translations for ${lang}: ${error}`, true);
			await i18n.changeLanguage('en');
			return {
				success: false,
				reason: `Error applying translations for ${
					SUPPORTED_LANGUAGES.find(({ code }) => code === lang)?.name
				}, falling back to English`,
			};
		}
	}

	private async loadTranslations(lang: Languages['code']): Promise<Record<string, string> | null> {
		const response = await apiService.getTranslation(lang);

		if (response.error) {
			this.log(`Error for ${lang}: code ${response.error.code}, message ${response.error.details ?? response.error.message}`, true);
			return null;
		}

		if (response.data && typeof response.data === 'object' && response.data !== null) {
			const { translation } = response.data;
			if (Object.keys(translation).length === 0) {
				this.log(`Empty translations object received for ${lang}`, true);
				return null;
			}
			return translation;
		} else {
			this.log(`Unexpected response structure for ${lang}`, true);
			return null;
		}
	}

	private async clearOldCaches(): Promise<void> {
		if (typeof caches !== 'undefined') {
			const cache = await caches.open(this.CACHE_NAME);
			const keys = await cache.keys();
			const currentVersionPrefix = `_v${this.version}`;

			for (const request of keys) {
				if (!request.url.endsWith(currentVersionPrefix)) {
					await cache.delete(request);
				}
			}
		}
	}

	private getCacheKey(lang: string): string {
		return `translation_${lang}_v${this.version}`;
	}
}

export const getLanguageManager = (version: string) => LanguageManager.getInstance(version);
