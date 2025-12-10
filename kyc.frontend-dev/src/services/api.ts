import axios, { AxiosError, AxiosResponse } from 'axios';
import { Languages } from 'src/utils/i18n';
import { t } from 'i18next';
import { documentDetectionErrorsCountAtom } from 'src/models/Camera';
import { ctx } from 'src/models';

const AUTH_TOKEN = '77d1e968e72a3d944ac31729832f77c0d93177413df0c534c9f020f8ba7730212';
const USER_TOKEN = '3d1e968e72a3d944ac31729832f77c0d93177413df0c534c9f020f8ba7730212';
const API_URL = 'https://kyc.impaya.com/api/v1/';
const AVATAR_API_URL = 'https://demo.vibo.tips/api/avatar/selfie';

export interface ApiError {
	code: number;
	message: string;
	details?: string;
}

// Axios instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request(endpoint: string, data: unknown): Promise<{ data?: any; error?: ApiError }> {
	try {
		const response: AxiosResponse = await axios.post(`${API_URL}${endpoint}`, data, {
			headers: {
				Authorization: `Basic ${AUTH_TOKEN}`,
			},
		});
		return { data: response.data };
	} catch (e) {
		const err = e as AxiosError;
		if (err.response) {
			const responseData = err.response.data as { error: ApiError };
			return {
				error: responseData.error || {
					code: -1,
					message: typeof responseData === 'string' ? responseData : t('unknown_error'),
				},
			};
		} else {
			return {
				error: {
					code: -1,
					message: err.message || t('unknown_error_network'),
				},
			};
		}
	}
}

export const apiService = {
	// Create sessions
	async createSession() {
		const response = await request('session/generate', {
			allowedCountries: ['Azerbaijan', 'Latvia', 'LV', 'LT', 'AZ', 'UA'],
			allowedDocs: ['passport', 'id-card', 'residence-permit'],
			callback_url: 'callbackURL',
			redirect_url: 'google.com',
			requiredSteps: ['document-check', 'liveness', 'utility-check'],
			previousVerifications: {},
			projectPayload: {
				termsUrl: '',
				logoUrl: '',
			},
		});

		if (response.error) throw response.error;
		return response.data;
	},

	// Verify document
	async verifyDocument(sessionId: string, image: string, flip: number = 0) {
		const response = await request('verification/readPassport', {
			mode: 2,
			passportbase64: image,
			sessionToken: sessionId,
			userToken: USER_TOKEN,
			flip: flip,
		});

		if (response.error) return response.error;
		return response.data;
	},

	// Verify liveness
	async verifyLiveness(sessionId: string, images: string[]) {
		const response = await request('verification/livenessSimilarity', {
			userToken: USER_TOKEN,
			sessionToken: sessionId,
			image_base64: images,
			mode: 2,
		});

		if (response.error) throw response.error;
		return response.data;
	},

	// Get session data
	async getSessionData(sessionId: string) {
		const response = await request('session/getSessionData', {
			sessionId,
		});

		if (response.error) throw response.error;
		return response.data;
	},

	// Verify utility bill
	async verifyUtilityBill(sessionId: string, image: string) {
		const response = await request('verification/readUtility', {
			sessionToken: sessionId,
			image_base64: image,
			mode: 2,
		});

		if (response.error) throw response.error;
		return response.data;
	},

	// Confirm utility bill information
	async confirmUtilityBill(sessionId: string, confirm: boolean = true) {
		const response = await request('verification/confirmUtility', {
			sessionToken: sessionId,
			confirm: confirm ? 1 : 0,
		});
		if (response.error) throw response.error;
		return response.data;
	},

	// Check session
	async checkSession(sessionId: string) {
		const response = await request('session/check', {
			sessionId,
		});

		if (response.error) throw response.error;
		return response.data;
	},

	// Delete session
	async deleteSession(sessionId: string) {
		const response = await request('session/deleteSession', {
			sessionId,
		});
		if (response.error) throw response.error;
		return response.data;
	},

	// Get translations
	async getTranslation(lang: Languages['code']) {
		const response = await request('localization/get', {
			language: lang,
			project: 'kyc',
			type: 'common',
		});
		if (response.error) throw response.error;
		return response.data;
	},

	// Modify client payload
	async modifyClientPayload(sessionId: string, payload: Record<string, unknown>) {
		const response = await request('session/modifyClientPayload', {
			sessionId,
			payloadData: payload,
		});
		if (response.error) throw response.error;
		return response.data;
	},
};

export const sendSelfie = async (token: string, image: string) => {
	try {
		const url = `${AVATAR_API_URL}/upload/${token}`;
		const blob = base64ToBlob(image, 'image/jpeg');
		const file = new File([blob], 'selfie.jpg', {
			type: 'image/jpeg',
			lastModified: Date.now(),
		});

		const formData = new FormData();
		formData.append('selfie', file);
		const resp = await axios.post(url, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return resp.data;
	} catch (err) {
		console.error(err);
		return (err as AxiosError).response?.data;
	}
};

export const sendSelfieStatus = async (token: string, status: 'opened' | 'canceled') => {
	const url = `${AVATAR_API_URL}/status/${token}`;
	axios.post(url, { status });
};

// Detect document
export const detectDocument = async (sessionId: string | null, image: string) => {
	if (!sessionId) {
		return { hasDocument: false };
	}
	const data = new FormData();
	data.append('image', image);

	try {
		const response = (
			await axios.post('https://ai2.impaya.com/api/v1/ocr/detectKYCDocument', data, {
				// responseType: 'multipart/form-data',
				headers: {
					'Content-Type': 'multipart/form-data',
					Accept: 'application/json',
					Authorization: `Basic 3d1e968e72a3d944ac31729832f77c0d93177413df0c534c9f020f8ba7730212`,
				},
			})
		).data;
		if (response.error) throw response.error;
		return { hasDocument: response.data.x2 !== null && response.data.x2 > 0, rect: response.data };
	} catch (err) {
		console.error('[detectDocument]', err);
		if ((err as AxiosError).code === 'ERR_NETWORK') documentDetectionErrorsCountAtom(ctx, (count) => count + 1);
		// return (err as AxiosError).response?.data;
		return { hasDocument: false };
	}
};

function base64ToBlob(base64: string, mime: string) {
	const byteString = atob(base64.split(',')[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ab], { type: mime });
}
