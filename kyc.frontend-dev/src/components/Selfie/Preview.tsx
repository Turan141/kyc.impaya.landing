import { Box } from '@ui/box/Box';
import Button from '@ui/button/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	photo: string;
	onRetake: () => void;
	onApply: () => void;
	isEmbedded?: boolean;
};

export const PreviewSelfie: FC<Props> = ({ photo, onRetake, onApply, isEmbedded }) => {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				overflow: 'hidden',
				width: '100%',
				height: '100%',
				flexGrow: 1,
				alignItems: 'center',
				justifyContent: 'center',
				padding: '1rem',
				backgroundColor: '#fafafa',
			}}
		>
			<Box
				sx={{
					maxWidth: '100%',
					borderRadius: '1rem',
					overflow: 'hidden',
					marginBottom: '2rem',
					...(isEmbedded ? { marginLeft: '3rem', marginRight: '3rem' } : {}),
				}}
			>
				<img src={photo} style={{ maxWidth: '100%', width: '100%', height: '100%', objectFit: 'contain' }} />
			</Box>

			<Box sx={{ width: '100%', marginBottom: '1rem' }}>
				<Button onClick={onRetake} variant="secondary" sx={{ marginBottom: '1rem' }}>
					{t('retake')}
				</Button>
				<Button onClick={onApply}>{t('apply')}</Button>
			</Box>
		</Box>
	);
};
