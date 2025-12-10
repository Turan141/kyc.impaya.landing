import Button from '@ui/button/Button';
import Spacer from '@ui/spacer/Spacer';
import { Typo, TypoCaption } from '@ui/text/Typo';
import { Box } from '@ui/box/Box';
import { FC, useEffect, useState } from 'react';
import { Spinner } from '@ui/spinner/Spinner';
import { IconCheckBig, IconErrorBig } from '@ui/icons';
import { useTranslation } from 'react-i18next';

export const Counter = ({ value }: { value: number }) => {
	const [display, setCounter] = useState(value);

	useEffect(() => {
		const interval = setInterval(() => {
			setCounter((prev) => (prev > 0 ? prev - 1 : prev));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return <>{display}</>;
};

export type InformerState = 'busy' | 'error' | 'success';

interface InformerProps {
	state: InformerState;
	errorMessage?: string;
	needsFlip?: boolean;
	onContinue: (retake: boolean) => void;
	onCancel?: () => void;
	timeout?: number;
	isLiveness?: boolean;
}

export const Informer: FC<InformerProps> = ({
	state,
	errorMessage,
	needsFlip = false,
	onContinue,
	onCancel,
	timeout = 10,
	isLiveness = false,
}) => {
	const { t } = useTranslation();

	// Auto-close timer
	useEffect(() => {
		let timer: NodeJS.Timeout | undefined;

		if (state === 'success') {
			timer = setTimeout(() => {
				onContinue(false);
			}, timeout * 1000);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [state, timeout, onContinue]);

	// Determine title and subtitle based on state
	let title = '';
	let subtitle = '';

	switch (state) {
		case 'busy':
			title = t('verification_in_progress');
			subtitle = t('please_wait_moment');
			break;
		case 'error':
			title = t('verification_failed');
			subtitle = errorMessage || t('unknown_error');
			break;
		case 'success':
			title = isLiveness ? t('verification_complete_liveness') : t('document_verification_complete');
			subtitle = isLiveness ? '' : needsFlip ? t('need_document_backside') : t('next_step');
			break;
	}

	return (
		<Box
			style={{
				top: 0,
				left: 0,
				animation: 'fadeIn 0.3s ease-in-out',
			}}
			sx={{
				position: 'absolute',
				zIndex: 11,
				padding: '20px',
				backgroundColor: 'white',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Spacer grow />
			{state !== 'busy' && (state === 'success' ? <IconCheckBig /> : <IconErrorBig />)}
			{state === 'busy' && <Spinner />}
			<Spacer size="16px" />
			<Typo
				sx={{
					userSelect: 'none',
					paddingLeft: '20px',
					paddingRight: '20px',
					fontSize: '24px',
					fontWeight: '500',
					textAlign: 'center',
				}}
			>
				{title}
			</Typo>
			{subtitle && (
				<>
					<Spacer size="10px" />
					<Typo
						sx={{
							userSelect: 'none',
							paddingLeft: '20px',
							paddingRight: '20px',
							fontSize: '18px',
							fontWeight: '400',
							textAlign: 'center',
						}}
					>
						{subtitle}
					</Typo>
				</>
			)}

			<Spacer grow />

			{state !== 'busy' && (
				<Button
					color="#FFFFFF"
					sx={{ width: '100%' }}
					onClick={() => {
						onContinue(state === 'error');
					}}
				>
					{state === 'error' ? t('retake_photo') : t('continue')}
				</Button>
			)}

			<Spacer size="10px" />

			{onCancel && (
				<Button variant="secondary" sx={{ width: '100%' }} onClick={() => onCancel()}>
					{t('cancel')}
				</Button>
			)}

			<Spacer size="20px" />
			{state === 'success' && (
				<TypoCaption>
					{t('auto_proceed_in')} <Counter value={timeout} /> {t('seconds')}
				</TypoCaption>
			)}
			<Spacer size="20px" />
		</Box>
	);
};
