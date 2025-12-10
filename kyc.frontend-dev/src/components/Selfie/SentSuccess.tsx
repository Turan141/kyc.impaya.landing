import { useAction } from '@reatom/npm-react';
import { Box } from '@ui/box/Box';
import { IconCheckBig } from '@ui/icons';
import Spacer from '@ui/spacer/Spacer';
import { Typo, TypoCaption } from '@ui/text/Typo';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { releaseCameraAction } from 'src/models/Camera';

export const SelfieSent: FC<{ isEmbedded: boolean; targetOrigin: string }> = ({ isEmbedded, targetOrigin }) => {
	const [timeout, setTimeout] = useState(0);
	const releaseCamera = useAction(releaseCameraAction);
	const { t } = useTranslation();

	useEffect(() => {
		releaseCamera();
		if (!isEmbedded) return;
		if (timeout === 0) {
			setTimeout(1);
			window.parent.postMessage(
				{ type: 'BUTTON_CLOSE_CLICK' },
				import.meta.env.VITE_LOCAL_CLIENT ? 'http://localhost:3000' : (targetOrigin ?? ''),
			);
			return;
		}
		const id = window.setTimeout(() => setTimeout(timeout - 1), 1000);

		return () => clearTimeout(id);
	}, [timeout]);

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
			{!isEmbedded && (
				<>
					<IconCheckBig />

					<Spacer size="24px" />

					<Typo sx={{ fontSize: '24px', fontWeight: '500', textAlign: 'center' }}>{t('selfie_done')}</Typo>

					<Spacer size="24px" />

					<Typo sx={{ fontSize: '16px', fontWeight: '500', textAlign: 'center' }}>
						{t(isEmbedded ? 'selfie_done_subtitle_embedded' : 'selfie_done_subtitle')}
					</Typo>

					<Spacer size="20px" />
					{isEmbedded && (
						<TypoCaption>
							{t('auto_close_in')} {timeout} {t('second', { count: timeout })}
						</TypoCaption>
					)}
					<Spacer size="20px" />
				</>
			)}
		</Box>
	);
};
