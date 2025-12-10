import { Box } from '@ui/box/Box';
import { IconErrorBig } from '@ui/icons';
import Spacer from '@ui/spacer/Spacer';
import { Typo } from '@ui/text/Typo';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const SelfieCancel: FC = () => {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				flexGrow: 1,
				backgroundColor: '#fafafa',
				padding: '1rem',
			}}
		>
			<IconErrorBig />

			<Spacer size="24px" />

			<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('selfie_cancel')}</Typo>

			<Spacer size="24px" />

			<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>{t('selfie_cancel_subtitle')}</Typo>
		</Box>
	);
};
