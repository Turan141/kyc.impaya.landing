import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { changeFavicon } from 'src/utils';
import { REQ_CHANGE_LANGUAGE } from 'src/utils/i18n';
import { apiService } from '../services/api';

export type Project = 'vt' | 'am';

interface SessionContextValue {
	sessionId: string | null;
	isEmbedded: boolean;
	targetOrigin: string;
	logoUrl: string | null;

	// API
	createSession: (token?: string | null) => Promise<SessionStatus>;
	verifyDocument: (image: string, flip: number) => Promise<any>;
	verifyLiveness: (photos: string[]) => Promise<any>;
	modifyPayload: (payload: Record<string, unknown>) => Promise<any>;
	verifyUtilityBill: (image: string) => Promise<any>;
	confirmUtilityBill: (confirm: boolean) => Promise<any>;
	getSessionData: () => Promise<any>;
	flushSession: () => Promise<void>;
	clearError: () => void;

	// Statuses
	isInitLoading: boolean;
	isLoading: boolean;
	error: string | null;
	documentVerified: boolean;
	livenessVerified: boolean;
	utilityBillVerified: boolean;
	sessionStatus: SessionStatus | null;

	requiredSteps: string[];
	currentStep: string | null;
	setCurrentStep: (step: string | null) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
	// Base
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitLoading, setIsInitLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Statuses
	const [documentVerified, setDocumentVerified] = useState(false);
	const [livenessVerified, setLivenessVerified] = useState(false);
	const [utilityBillVerified, setUtilityBillVerified] = useState(false);
	const [requiredSteps, setRequiredSteps] = useState<string[]>([]);
	const [currentStep, setCurrentStep] = useState<string | null>(null);
	const [isEmbedded, setIsEmbedded] = useState(true);
	const [targetOrigin, setTargetOrigin] = useState<string>('');
	const [logoUrl, setLogoUrl] = useState<string | null>(null);
	const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);

	useEffect(() => {
		if (window.self === window.top) return;

		window.parent.postMessage({ type: 'REQUEST_ORIGIN' }, targetOrigin || '*');

		function onMessage(event: MessageEvent) {
			if (event.data && event.data.type === 'REPLY_ORIGIN' && event.data.origin) {
				const parentOrigin = event.data.origin;
				setTargetOrigin(parentOrigin);
				window.removeEventListener('message', onMessage);
			}
		}
		window.addEventListener('message', onMessage);
	}, []);

	const createSession = async (token?: string | null): Promise<SessionStatus> => {
		setIsLoading(true);
		setIsInitLoading(true);
		setError(null);

		let sessionToken: string | null = null;

		// 1. Check token or get a new one
		if (token) {
			const sessionResponse = await apiService.checkSession(token);

			if (!sessionResponse?.data?.isValid) {
				setIsLoading(false);
				setIsInitLoading(false);
				if (sessionResponse.data.sesstion?.status === 'request.pending') {
					setSessionStatus('expired');
					return 'expired';
				}
				if (sessionResponse.data.sesstion?.status === 'verification.cancelled') {
					setSessionStatus('canceled');
					return 'canceled';
				}
				if (sessionResponse.data.sesstion?.status === 'verification.declined') {
					setSessionStatus('declained');
					return 'declained';
				}
				if (sessionResponse.data.sesstion?.status === 'verification.accepted') {
					setSessionStatus('accepted_bun_invalid');
					return 'accepted_bun_invalid';
				}
				if (sessionResponse.data.sesstion === null) {
					setSessionStatus('not_exists');
					return 'not_exists';
				}
				setSessionStatus('invalid');
				return 'invalid';
			}

			sessionToken = token;
			setSessionId(token);
		} else {
			try {
				const response = await apiService.createSession();
				sessionToken = response.data.rtv;
				setSessionId(sessionToken);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error on create session');
				setIsLoading(false);
				setIsInitLoading(false);
				setSessionStatus('invalid');
				return 'invalid';
			}
		}

		// 2. Check steps for token
		try {
			const sessionData = await apiService.getSessionData(sessionToken as string);
			if (sessionData?.data?.response === null) {
				setIsLoading(false);
				setIsInitLoading(false);
				setSessionStatus('invalid');
				return 'invalid';
			}
			if (sessionData.data.response?.status === 'verification.cancelled') {
				setIsLoading(false);
				setIsInitLoading(false);
				setSessionStatus('canceled');
				return 'canceled';
			}
			if (sessionData.data.response?.status === 'verification.declined') {
				setIsLoading(false);
				setIsInitLoading(false);
				setSessionStatus('declained');
				return 'declained';
			}
			if (sessionData.data.response?.status === 'verification.accepted') {
				setIsLoading(false);
				setIsInitLoading(false);
				setSessionStatus('accepted');
			}
			if (sessionData?.data?.response?.requirements?.requiredSteps) {
				const steps = sessionData.data.response.requirements.requiredSteps;
				setRequiredSteps(steps);
				setCurrentStep(steps[0] || null);
			}
			setIsEmbedded(sessionData?.data?.response?.clientPayload?.isEmbedded ?? false);
			if (sessionData?.data?.response?.clientPayload?.lang) {
				REQ_CHANGE_LANGUAGE.request(sessionData.data.response.clientPayload.lang);
			}

			if (sessionData?.data?.response?.projectPayload) {
				if (sessionData.data.response.projectPayload.logoUrl) {
					setLogoUrl(sessionData.data.response.projectPayload.logoUrl);
					const url = new URL(sessionData.data.response.projectPayload.logoUrl);
					let logoUrl = '';
					if (url.hostname.includes('vibo.tips') || url.hostname.includes('amazing.money')) {
						logoUrl = `${url.origin}/favicon.ico`;
					}
					changeFavicon(logoUrl);
				}
			}

			setIsLoading(false);
			setIsInitLoading(false);
			setSessionStatus('ok');
			return 'ok';
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error fetching session data');
			setIsLoading(false);
			setIsInitLoading(false);
			setSessionStatus('invalid');
			return 'invalid';
		}
	};

	// Document verification
	const verifyDocument = async (image: string, flip: number = 0) => {
		if (!sessionId) {
			return false;
		}

		setIsLoading(true);
		setError(null);
		try {
			const response = await apiService.verifyDocument(sessionId, image, flip);

			if (response.data) {
				setDocumentVerified(true);
				return response.data;
			}
			return response;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'verifyDocument error');
			return err;
		} finally {
			setIsLoading(false);
		}
	};

	// Liveness Verification
	const verifyLiveness = async (photos: string[]): Promise<any> => {
		try {
			setError(null);
			setIsLoading(true);

			if (!sessionId) {
				throw new Error('No active session');
			}

			const response = await apiService.verifyLiveness(sessionId, photos);
			if (response.data && response.data.status === 'success') {
				setLivenessVerified(true);
				return response.data;
			} else {
				console.error(response.data.message || 'Liveness verification failed');
				return response.data;
			}
		} catch (err) {
			console.error(err instanceof Error ? err.message : 'Unknown error on liveness check');
			return err;
		} finally {
			setIsLoading(false);
		}
	};

	// Modify client payload
	const modifyPayload = async (payload: Record<string, unknown>) => {
		if (!sessionId) {
			throw new Error('No active session');
		}
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiService.modifyClientPayload(sessionId, payload);
			return response;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error modifying client payload');
			return err;
		} finally {
			setIsLoading(false);
		}
	};

	// Get session data
	const getSessionData = async () => {
		if (!sessionId) {
			setError('No active session');
			throw new Error('No active session');
		}

		setIsLoading(true);
		setIsInitLoading(true);
		setError(null);
		try {
			const response = await apiService.getSessionData(sessionId);
			setIsLoading(false);
			setIsInitLoading(false);
			if (response?.data?.response === null) {
				throw new Error();
			}
			return response.data?.response;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error on getting session');
			setIsLoading(false);
			setIsInitLoading(false);
			throw err;
		}
	};

	const flushSession = async () => {
		setSessionId(null);
		setDocumentVerified(false);
		setLivenessVerified(false);
		setUtilityBillVerified(false);
		setCurrentStep(null);
		setRequiredSteps([]);

		if (!sessionId) return;
		apiService.deleteSession(sessionId);
	};

	const verifyUtilityBill = async (image: string) => {
		if (!sessionId) {
			setError('No active session');
			return false;
		}

		setIsLoading(true);
		setError(null);
		try {
			const response = await apiService.verifyUtilityBill(sessionId, image);
			setIsLoading(false);
			return response?.data;
		} catch (err) {
			setError((err as { details: string }).details || (err as { message: string }).message || 'Error verifying utility bill');
			setIsLoading(false);
			return err;
		}
	};

	const confirmUtilityBill = async (confirm: boolean = true) => {
		if (!sessionId) {
			setError('No active session');
			return false;
		}

		setIsLoading(true);
		setError(null);
		try {
			const response = await apiService.confirmUtilityBill(sessionId, confirm);
			if (confirm) {
				setUtilityBillVerified(true);
			}
			setIsLoading(false);
			return response;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Error confirming utility bill');
			setIsLoading(false);
			return false;
		}
	};

	const clearError = () => {
		setError('');
	};

	return (
		<SessionContext.Provider
			value={{
				sessionId,
				isEmbedded,
				targetOrigin,
				logoUrl,
				createSession,
				verifyDocument,
				verifyLiveness,
				modifyPayload,
				getSessionData,
				flushSession,
				isLoading,
				isInitLoading,
				sessionStatus,
				error,
				documentVerified,
				livenessVerified,
				clearError,
				utilityBillVerified,
				verifyUtilityBill,
				confirmUtilityBill,
				requiredSteps,
				currentStep,
				setCurrentStep,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error('useSession must be used inside SessionProvider');
	}
	return context;
}
