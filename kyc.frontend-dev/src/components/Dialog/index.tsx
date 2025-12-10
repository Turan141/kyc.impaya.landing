import { Box } from '@ui/box/Box';
import Panel from '@ui/panel/Panel';
import Spacer from '@ui/spacer/Spacer';
import { IDialogRequest } from '../../contexts/DialogContext';
import { Typo, TypoCaption, TypoHead } from '@ui/text/Typo';
import Button from '@ui/button/Button';
import { useCheckMobileDevice } from 'src/utils';

export const Dialog = ({ request, onButtonClick }: { request: IDialogRequest; onButtonClick: (index: number) => void }) => {
	const isMobile = useCheckMobileDevice();
	const isPortrait = window.innerWidth < window.innerHeight;

	const style =
		isPortrait && isMobile
			? { gap: '10px', display: 'grid', gridTemplateColumns: '1fr' }
			: {
					gap: '10px',
					display: 'grid',
					gridTemplateColumns: 'auto ' + request.buttons?.map(() => 'minmax(0,max-content)').join(' '),
				};

	return (
		<Panel
			decorator="absolute"
			sx={{
				borderRadius: '16px',
				padding: '30px',
				gap: '0px',
				minWidth: '290px',
				width: '100%',
				maxWidth: '580px',
				margin: '0 24px',
			}}
		>
			<TypoHead>{request.title}</TypoHead>
			<hr
				style={{
					width: '100%',
					border: 'none',
					color: 'rgba(0, 0, 0, 0.09)',
					backgroundColor: 'rgba(0, 0, 0, 0.09)',
					height: 1,
				}}
			/>
			<Spacer size="30px" />
			{request.subtitle && <TypoCaption>{request.subtitle}</TypoCaption>}
			<Typo variant="text" sx={{ lineHeight: '1.2rem' }}>
				{request.content}
			</Typo>
			<Spacer size="30px" />
			<Box sx={style}>
				<Spacer />
				{request.buttons?.map((button, index) => {
					return (
						<Button
							title={button.title}
							sx={{ fontSize: '1rem' }}
							key={index}
							variant={index === 0 ? 'primary' : 'secondary'}
							onClick={() => onButtonClick(index)}
						/>
					);
				})}
			</Box>
		</Panel>
	);
};
