import React, { JSX } from 'react';
import { useTheme } from 'styled-components';
import { Box } from '../box/Box';
import Spacer from '../spacer/Spacer';
import { ITheme } from '../theme/GlobalTheme';

export type TButtons = typeof getDefaultButtons;
export type TButtonVariant = keyof TButtons;

const defaultButton: React.CSSProperties & Record<'&:hover', React.CSSProperties> = {
	padding: '16px 20px',
	borderRadius: '6px',
	cursor: 'pointer',
	boxShadow: '0px 0px 10px rgba(0,0,0,.1)',
	transition: 'background-color .2s, border .2s, opacity .15s',
	display: 'flex',
	alignItems: 'center',
	position: 'relative',
	gap: '10px',
	fontWeight: '400',
	userSelect: 'none',
	fontSize: '.95rem',
	justifyContent: 'center',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	backgroundColor: 'buttonBackgroundPrimary',
	color: 'buttonTextPrimary',
	opacity: 1,

	'&:hover': {
		backgroundColor: 'buttonBackgroundPrimaryHover',
	},

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore: it's valid CSS selector
	'&:active': {
		opacity: 0.8,
	},
};

const secondary: React.CSSProperties & Record<'&:hover', React.CSSProperties> = {
	...defaultButton,
	backgroundColor: 'transparent',
	border: '1px solid rgba(127,116,116,.1)',
	boxShadow: 'none',
	fontWeight: '400',
	color: 'buttonTextSecondary',
	'&:hover': {
		backgroundColor: 'rgba(0,0,0,.02)',
	},
};

const small: React.CSSProperties = {
	fontSize: '.8rem',
	padding: '10px 16px',
};

export const getDefaultButtons = {
	primary: { ...defaultButton },
	secondary: { ...secondary },

	empty: {
		...defaultButton,
		boxShadow: 'none',
		backgroundColor: 'transparent',
		'&:hover': {
			backgroundColor: 'transparent',
		},
	},

	icon: {
		...defaultButton,
		border: '0px solid buttonBackgroundSecondary',
		boxShadow: 'none',
		backgroundColor: 'transparent',
		padding: '10px',
		'&:hover': {
			backgroundColor: 'transparent', // "buttonBackgroundSecondary",
			border: '0px solid buttonBackgroundPrimary',
		},
	},
	primarySmall: {
		...defaultButton,
		...small,
	},

	secondarySmall: {
		...secondary,
		...small,
	},

	emptySmall: { ...defaultButton },
};

interface IButtonProps {
	onClick: (e?: any) => void;
	children?: any;
	title?: string;
	variant?: TButtonVariant;
	sx?: React.CSSProperties;
	iconRight?: JSX.Element;
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	warning?: boolean;
	color?: string;
	decorator?: 'form';
	icon?: JSX.Element;
	center?: boolean;
	testid?: string;
}

const Button = ({ onClick, icon, children, variant, sx, iconRight, disabled, title, center, testid }: IButtonProps) => {
	if (!variant && icon && !title && !children) variant = 'icon';

	if (!variant) variant = 'primary';

	let tsx = {} as React.CSSProperties;

	if (!children && title) children = title;
	const content = children;

	const theme = useTheme() as ITheme;
	if (theme && theme.buttons && theme.buttons[variant]) tsx = theme.buttons[variant];

	return (
		<Box
			sx={{
				...tsx, //variant
				...sx, // user styles
				pointerEvents: disabled ? 'none' : 'auto',
				opacity: disabled ? 0.5 : 1,
			}}
			onClick={disabled ? () => {} : onClick}
			testid={testid}
		>
			{icon && <Box sx={{ alignItems: 'center', lineHeight: '0px' }}>{icon}</Box>}

			{content}

			{iconRight && (
				<>
					{!center && <Spacer grow />}
					<Box sx={{ lineHeight: '0px' }}>{iconRight}</Box>
				</>
			)}
		</Box>
	);
};

export default Button;
