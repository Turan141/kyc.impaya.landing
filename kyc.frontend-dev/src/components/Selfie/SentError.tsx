import { Box } from '@ui/box/Box';
import Button from '@ui/button/Button';
import { IconErrorBig } from '@ui/icons';
import Spacer from '@ui/spacer/Spacer';
import { Typo } from '@ui/text/Typo';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	isCritical: boolean;
	error?: string;
	onRetake: () => void;
};

export const SelfieSentError: FC<Props> = ({ isCritical, error, onRetake }) => {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				flexGrow: 1,
				backgroundColor: '#fafafa',
				padding: '1rem',
				height: '100%',
			}}
		>
			<IconErrorBig />

			<Spacer size="24px" />
			<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('selfie_failed')}</Typo>

			<Spacer size="24px" />

			{error && (
				<>
					<Typo
						sx={{
							fontSize: '16px',
							fontWeight: '500',
							textAlign: 'center',
							'&::first-letter': { textTransform: 'capitalize' },
						}}
					>
						{error}
					</Typo>
					<Spacer size="12px" />
				</>
			)}

			<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>
				{t(isCritical ? 'selfie_failed_subtitle_critical' : 'selfie_failed_subtitle')}
			</Typo>

			{!isCritical && (
				<>
					<Spacer size="24px" />

					<Box sx={{ display: 'flex' }}>
						<Button onClick={onRetake} sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
							{' '}
							{t('retake')}
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
};
