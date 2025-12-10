import { useState } from 'react';
import { Box } from '../box/Box';
import { Typo, TypoSmall } from '../text/Typo';

export const Checkbox = (params: {
	name?: string;
	label?: string | React.ReactNode;
	disable?: boolean;
	data?: any;
	onChange?: (checked: boolean) => void;
	sxLabel?: React.CSSProperties;
	sxChBox?: React.CSSProperties;
}) => {
	const [checked, setChecked] = useState<boolean>(
		params.data && typeof params.data === 'object' && params.name && typeof params.name === 'string' ? params.data[params.name] : false,
	);

	const handleClick = () => {
		const newVal = !checked;
		setChecked(newVal);
		if (params.data && typeof params.data === 'object' && params.name && typeof params.name === 'string')
			params.data[params.name] = newVal;
		if (params.onChange) params.onChange(newVal);
	};

	const content = (
		<Box
			sx={{
				flexShrink: '0',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				border: '1px solid rgba(0,0,0,.25)',
				borderRadius: '5px',
				backgroundColor: '#FFFFFF', //"#F2F2F2",
				transition: 'background-color .2s, border .2s, border-color .2s',
				width: '20px',
				height: '20px',
				cursor: params.disable ? undefined : 'pointer',
				pointerEvents: params.disable ? 'none' : undefined,
				marginTop: params.label && params.sxLabel ? '2px' : undefined,
				'&:hover': {
					border: params.disable ? undefined : '1px solid #35539f',
				},
				...(params.sxChBox ?? {}),
			}}
			onClick={!params.label ? handleClick : () => {}}
		>
			{checked && (
				<Box
					sx={{
						width: '10px',
						height: '10px',
						backgroundColor: '#201d1d',
						borderRadius: '3px',
					}}
				></Box>
			)}
		</Box>
	);

	if (!params.label) return content;

	return (
		<Box
			sx={{
				display: 'flex',
				gap: '15px',
				alignItems: 'flex-start',
				userSelect: 'none',
				cursor: 'pointer',
			}}
			onClick={handleClick}
		>
			{content}
			{params.sxLabel ? <Typo sx={{ ...params.sxLabel }}>{params.label}</Typo> : <TypoSmall>{params.label}</TypoSmall>}
		</Box>
	);
};
