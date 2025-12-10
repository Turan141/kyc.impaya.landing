import { useDialog, useSession } from '@contexts/index';
import { useAction } from '@reatom/npm-react';
import { Box, HBox, VBox } from '@ui/box/Box';
import Button from '@ui/button/Button';
import { Checkbox } from '@ui/checkbox/Checkbox';
import { IconCamera, IconCrossCircle, IconDocument, IconSuccess, IconSun } from '@ui/icons';
import Spacer from '@ui/spacer/Spacer';
import { Spinner } from '@ui/spinner/Spinner';
import { Typo } from '@ui/text/Typo';
import { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Receipt } from 'src/components/icons/Receipt';
import { initFaceMesh } from 'src/models/FaceMesh';
import { useCheckMobileDevice } from 'src/utils';
import { AppPage } from '../../App';

type Props = {
	onNavigate: (page: AppPage) => void;
};

export const BeginPage: FC<Props> = ({ onNavigate }) => {
	const [data, setData] = useState({ terms: false });
	const [shouldHighlightCheckbox, setShouldHighlightCheckbox] = useState(false);
	const [isCancelled, setIsCancelled] = useState(false);
	const { showDialog } = useDialog();
	const { createSession, isLoading, error, requiredSteps, isEmbedded, flushSession } = useSession();
	const { t } = useTranslation();
	const [tokenStatus, setTokenStatus] = useState<SessionStatus | 'loading'>('loading');
	const isMobile = useCheckMobileDevice();
	const initFM = useAction(initFaceMesh);

	const hasDocumentCheck = requiredSteps.includes('document-check');
	const hasLiveness = requiredSteps.includes('liveness');
	const hasUtilityCheck = requiredSteps.includes('utility-check');
	const hasSelfieAvatar = requiredSteps.includes('selfie-avatar');

	useEffect(() => {
		const checkUrlToken = async () => {
			const url = new URL(window.location.href);
			const params = new URLSearchParams(url.search);
			const token = params.get('token');
			const status = await createSession(token);
			setTokenStatus(status);
		};

		checkUrlToken();
		initFM();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (data.terms) {
			setShouldHighlightCheckbox(false);
		}
	}, [data.terms]);

	const handleBeginClick = async () => {
		if (tokenStatus !== 'ok') return;
		if (!data.terms) {
			setShouldHighlightCheckbox(true);
			return;
		}
		onNavigate('camera');
	};

	if (tokenStatus === 'loading' || isLoading) {
		return (
			<VBox sx={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
				<Spinner size={40} />
			</VBox>
		);
	}

	if (isCancelled) {
		return (
			<VBox
				sx={{
					width: '100%',
					height: '100%',
					overflowY: 'auto',
					flexGrow: 1,
					padding: isMobile ? '24px 16px' : '32px 16px',
					alignItems: 'center',
					justifyContent: 'flex-start',
				}}
			>
				<Spacer size="32px" />
				<IconCrossCircle />

				<Spacer size="24px" />
				<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('verification_cancelled')}</Typo>

				<Spacer size="16px" />
				<Typo sx={{ fontSize: '16px', lineHeight: '24px', fontWeight: '500', textAlign: 'center', maxWidth: '350px' }}>
					{t('verification_cancelled_text')}
				</Typo>

				<Spacer size="32px" />
				<Typo sx={{ fontSize: '16px', fontWeight: '400', textAlign: 'center', color: '#12162160' }}>{t('can_close_tab')}</Typo>
			</VBox>
		);
	}

	if (tokenStatus !== 'ok') {
		return (
			<VBox
				sx={{
					display: 'flex',
					width: '100%',
					overflowY: 'auto',
					flexGrow: 1,
				}}
			>
				<VBox
					sx={{
						flexGrow: 1,
						padding: isMobile ? '24px 16px' : '32px 16px',
						width: '100%',
						alignItems: 'center',
					}}
				>
					<Spacer grow minHeight="20px" />
					<Typo sx={{ fontSize: '20px', fontWeight: '600', color: '#E53E3E', textAlign: 'center' }}>
						{t(getErrorTextKey(tokenStatus) + 'title')}
					</Typo>
					<Spacer size="16px" />
					<Typo sx={{ fontSize: '16px', color: '#4A5568', textAlign: 'center', lineHeight: '21px' }}>
						{t(getErrorTextKey(tokenStatus) + 'desc')}
					</Typo>
					<Spacer size="24px" />
					<Spacer grow minHeight="20px" />
				</VBox>
			</VBox>
		);
	}

	return (
		<VBox
			sx={{
				width: '100%',
				overflowY: 'auto',
				flexGrow: 1,
				padding: isMobile ? '24px 16px' : '32px 16px',
				alignItems: 'center',
			}}
		>
			<Spacer grow minHeight="20px" />

			{error && (
				<>
					<div style={{ color: 'red' }}>{error}</div>
					<Spacer size="20px" />
				</>
			)}

			<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('get_ferified_in_seconds')}</Typo>

			<Spacer size="24px" />

			<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>{t('before_you_begin')}</Typo>

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
				{hasDocumentCheck && (
					<HBox sx={{ gap: '16px' }}>
						<div>
							<IconDocument />
						</div>

						<VBox
							sx={{
								width: '100%',
								gap: '8px',
							}}
						>
							<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>{t('have_valid_document')}</Typo>

							<HBox sx={{ gap: '16px' }}>
								<HBox sx={{ gap: '8px', alignItems: 'center' }}>
									<IconSuccess />

									<Typo
										sx={{
											fontSize: '14px',
											fontWeight: '500',
											lineHeight: '24px',
										}}
									>
										{t('id_card')}
									</Typo>
								</HBox>
								<HBox sx={{ gap: '8px', alignItems: 'center' }}>
									<IconSuccess />
									<Typo
										sx={{
											fontSize: '14px',
											fontWeight: '500',
											lineHeight: '24px',
										}}
									>
										{t('passport')}
									</Typo>
								</HBox>
							</HBox>
						</VBox>
					</HBox>
				)}

				{hasUtilityCheck && (
					<HBox sx={{ gap: '16px' }}>
						<div>
							<Receipt color="#EC407A" />
						</div>

						<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>{t('have_utility_bill')}</Typo>
					</HBox>
				)}

				<HBox sx={{ gap: '16px' }}>
					<div>
						<IconSun />
					</div>
					<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>{t('ensure_you_are_in_welllit_area')}</Typo>
				</HBox>

				<HBox sx={{ gap: '16px' }}>
					<div>
						<IconCamera />
					</div>
					<Typo sx={{ fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
						{hasDocumentCheck && hasLiveness && hasUtilityCheck && t('check_doc_liveness_and_utility_bill')}
						{hasDocumentCheck && hasLiveness && !hasUtilityCheck && t('check_doc_and_liveness')}
						{!hasDocumentCheck && !hasLiveness && hasUtilityCheck && t('take_photos_of_utility_bill')}
						{!hasDocumentCheck && !hasLiveness && !hasUtilityCheck && hasSelfieAvatar && t('take_selfie')}
					</Typo>
				</HBox>
			</VBox>

			<Spacer size="32px" />

			<Box sx={{ margin: '0 18px' }}>
				<Checkbox
					data={data}
					onChange={(val: boolean) => setData({ ...data, terms: val })}
					key={'terms'}
					sxLabel={{
						fontSize: '16px',
						fontWeight: '400',
						lineHeight: '24px',
						color: shouldHighlightCheckbox ? 'red' : 'inherit',
						transition: 'color .2s',
					}}
					sxChBox={{ borderColor: shouldHighlightCheckbox ? 'red' : 'rgba(0,0,0,.25)' }}
					label={
						<Trans
							i18nKey="consens_terms_agree_full"
							components={{
								privacyLink: (
									<a
										style={{ color: 'inherit' }}
										href="/docs/Privacy.Notice.Ayasec.pdf"
										target="_blank"
										rel="noreferrer noopener"
									/>
								),
								termsLink: (
									<a
										style={{ color: 'inherit' }}
										href="/docs/Terms.and.Conditions.Ayasec.pdf"
										target="_blank"
										rel="noreferrer noopener"
									/>
								),
							}}
						/>
					}
				/>
			</Box>

			<Spacer grow minHeight="32px" />

			<Button
				sx={{ width: '100%', height: '58px', minHeight: '58px' }}
				onClick={handleBeginClick}
				disabled={isLoading}
				testid="button-proceed"
			>
				{isLoading ? <Spinner size={30} /> : t('proceed')}
			</Button>

			{!isEmbedded && (
				<>
					<Spacer size="16px" />

					<Button
						variant="secondary"
						sx={{ height: '58px', minHeight: '58px' }}
						onClick={async () => {
							const choice = await showDialog({
								title: t('verification'),
								content: t('break_verification_session'),
								buttons: [{ title: t('cancel_accept') }, { title: t('cancel_reject') }],
							});

							if (choice === 0) {
								setShouldHighlightCheckbox(false);
								flushSession();
								setIsCancelled(true);
							}
						}}
					>
						{t('cancel')}
					</Button>
				</>
			)}
		</VBox>
	);
};

BeginPage.displayName = 'BeginPage';

function getErrorTextKey(sessionStatus: SessionStatus): string {
	switch (sessionStatus) {
		case 'invalid':
			return 'unknown_error_';
		case 'expired':
			return 'session_expired_';
		case 'not_exists':
			return 'session_not_exists_';
		case 'accepted_bun_invalid':
			return 'session_accepted_bun_invalid_';
		case 'canceled':
			return 'session_canceled_';
		case 'declained':
			return 'session_declained_';
		default:
			return 'unknown_error_';
	}
}
