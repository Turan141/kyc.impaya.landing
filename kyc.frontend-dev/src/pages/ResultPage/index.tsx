import { useEffect, useMemo, useRef, useState } from 'react';
import { HBox, VBox } from '@ui/box/Box';
import Button from '@ui/button/Button';
import Spacer from '@ui/spacer/Spacer';
import { Typo } from '@ui/text/Typo';
import { useSession } from '@contexts/index';
import { Spinner } from '@ui/spinner/Spinner';
import { IconCheck, IconErrorBig, IconCheckBig, IconError, IconClock } from '@ui/icons';
import { useTranslation } from 'react-i18next';
import { AppPage } from '../../App';
import { getProjectUrl } from 'src/utils';

// Define clear, distinct UI states
type VerificationStatus = 'loading' | 'success' | 'failure';
type SessionApiStatus = 'verification.accepted' | 'verification.declined' | 'request.pending';

interface ResultPageProps {
	onNavigate: (page: AppPage) => void;
}

export function ResultPage({ onNavigate }: ResultPageProps) {
	const { t } = useTranslation();

	const {
		documentVerified,
		livenessVerified,
		utilityBillVerified,
		getSessionData,
		sessionId,
		error: sessionError,
		requiredSteps,
		logoUrl,
		isEmbedded,
		targetOrigin,
	} = useSession();

	// Main UI state
	const [status, setStatus] = useState<VerificationStatus>('loading');
	const documentRequired = useMemo(() => requiredSteps.includes('document-check'), [requiredSteps]);
	const livenessRequired = useMemo(() => requiredSteps.includes('liveness'), [requiredSteps]);
	const utilityBillRequired = useMemo(() => requiredSteps.includes('utility-check'), [requiredSteps]);

	const [apiStatus, setApiStatus] = useState<SessionApiStatus | null>(null);

	// Track if we've already fetched session data
	const sessionDataFetched = useRef(false);

	useEffect(() => {
		if (status !== 'success') return;

		if (isEmbedded) {
			setTimeout(() => {
				window.parent.postMessage(
					{ type: 'BUTTON_CLOSE_CLICK' },
					import.meta.env.VITE_LOCAL_CLIENT ? 'http://localhost:3000' : (targetOrigin ?? ''),
				);
			}, 3_000);
		} else if (logoUrl) {
			setTimeout(() => {
				const url = getProjectUrl(logoUrl);
				if (!url) return;
				window.location.href = url;
			}, 3_000);
		}
	}, [isEmbedded, status, logoUrl, targetOrigin]);

	useEffect(() => {
		if (!sessionId) {
			onNavigate('begin');
			return;
		}

		if (!sessionDataFetched.current) {
			const fetchSessionData = async () => {
				sessionDataFetched.current = true;
				try {
					const result = await getSessionData();

					if (result.status) {
						const apiResponseStatus = result.status;

						setApiStatus(apiResponseStatus);

						if (apiResponseStatus === 'verification.accepted') {
							setStatus('success');
							if (isEmbedded) window.parent.postMessage({ type: 'HIDE_BACK_BUTTON' }, targetOrigin);
						} else if (apiResponseStatus === 'verification.declined') {
							setStatus('failure');
						} else {
							setStatus('failure');
						}
					} else {
						console.error('No status in API response:', result);
						setStatus('success');
					}
				} catch (err) {
					console.error('Error getting session data:', err);
					// If error - show success
					setStatus('success');
				}
			};

			fetchSessionData();
		}
	}, [sessionId, getSessionData, onNavigate, isEmbedded, targetOrigin]);

	const handleRetry = () => {
		onNavigate('begin');
	};

	// Render different UI based on status
	let mainIcon;
	let title;
	let subtitle;

	switch (status) {
		case 'loading':
			mainIcon = <Spinner size={65} />;
			title = t('please_wait');
			subtitle = t('verification_progress');
			break;
		case 'failure':
			mainIcon = <IconErrorBig />;
			title = t('verification_failed');
			subtitle = sessionError || t('fail_subtitle');
			break;
		case 'success':
			mainIcon = <IconCheckBig />;
			title = t('verification_complete');
			subtitle = t('verification_success');
			break;
	}

	return (
		<VBox
			sx={{
				display: 'flex',
				height: '100%',
				width: '100%',
				overflowY: 'auto',
				alignItems: 'center',
				backgroundColor: '#fafafa',
			}}
		>
			<VBox
				sx={{
					flexGrow: 1,
					paddingRight: '16px',
					paddingLeft: '16px',
					width: '100%',
					alignItems: 'center',
					maxWidth: '500px',
				}}
			>
				<Spacer grow minHeight="20px" />

				{mainIcon}

				<Spacer size="24px" />

				<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{title}</Typo>

				<Spacer size="24px" />

				<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>
					{subtitle}
					{status === 'success' && (
						<>
							<br />
							{t('to_continue')}
						</>
					)}
				</Typo>

				<Spacer size="24px" />

				<VBox
					sx={{
						backgroundColor: '#FFFFFF',
						borderRadius: '24px',
						paddingRight: '16px',
						paddingLeft: '16px',
						paddingTop: '24px',
						paddingBottom: '24px',
						width: '100%',
						gap: '24px',
					}}
				>
					{/* Document status */}
					{documentRequired && (
						<HBox sx={{ gap: '16px' }}>
							{documentVerified ? <IconCheck /> : status === 'loading' ? <IconClock /> : <IconError />}

							<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
								{documentVerified ? t('id_success') : status === 'loading' ? t('id_progress') : t('id_fail')}
							</Typo>
						</HBox>
					)}

					{/* Liveness status */}
					{livenessRequired && (
						<HBox sx={{ gap: '16px' }}>
							{livenessVerified ? <IconCheck /> : status === 'loading' ? <IconClock /> : <IconError />}

							<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
								{livenessVerified
									? t('liveness_success')
									: status === 'loading'
										? t('liveness_progress')
										: t('liveness_fail')}
							</Typo>
						</HBox>
					)}

					{/* Utility status */}
					{utilityBillRequired && (
						<HBox sx={{ gap: '16px' }}>
							{utilityBillVerified ? <IconCheck /> : <IconClock />}
							<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
								{utilityBillVerified ? t('utility_bill_success') : t('utility_bill_progress')}
							</Typo>
						</HBox>
					)}

					<HBox sx={{ gap: '16px' }}>
						{apiStatus === 'verification.accepted' ? (
							<IconCheck />
						) : apiStatus === 'verification.declined' ? (
							<IconError />
						) : apiStatus === 'request.pending' ? (
							<IconClock />
						) : status === 'success' ? (
							<IconCheck />
						) : status === 'failure' ? (
							<IconError />
						) : (
							<IconClock />
						)}

						<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
							{apiStatus === 'verification.accepted'
								? t('final_success')
								: apiStatus === 'verification.declined'
									? t('final_fail')
									: apiStatus === 'request.pending'
										? t('final_progress')
										: status === 'success'
											? t('final_success')
											: status === 'failure'
												? t('final_fail')
												: t('final_progress')}
						</Typo>
					</HBox>
				</VBox>

				<Spacer grow minHeight="24px" />

				{status === 'success' && isEmbedded && (
					<Button onClick={() => window.parent.postMessage({ type: 'BUTTON_CLOSE_CLICK' }, targetOrigin)}>{t('continue')}</Button>
				)}

				{status === 'failure' && (
					<>
						<Button
							color="#FFFFFF"
							sx={{
								backgroundColor: 'rgba(20, 23, 31, 1)',
								paddingRight: '16px',
								paddingLeft: '16px',
								paddingTop: '12px',
								paddingBottom: '12px',
								justifyContent: 'center',
								width: '100%',
								boxShadow: 'none',
							}}
							onClick={handleRetry}
						>
							<Typo sx={{ fontSize: '20px', fontWeight: '500', textAlign: 'center' }}>{t('retry')}</Typo>
						</Button>
					</>
				)}

				<Spacer size="32px" />
			</VBox>
		</VBox>
	);
}
