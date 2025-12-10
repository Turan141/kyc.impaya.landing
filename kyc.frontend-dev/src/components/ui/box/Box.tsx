import { forwardRef } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { ITheme } from '../theme/GlobalTheme';

/*| SystemCssProperties<Theme>
  | CSSPseudoSelectorProps<Theme>
  | CSSSelectorObjectOrCssVariables<Theme>
  | null;*/

export function createCSSFromObject(css: React.CSSProperties): string {
	let rules = '';
	for (let i in css) {
		if (!(css as any)[i]) continue;
		const name = i.replaceAll(/([A-Z])/g, '-$1').toLowerCase();
		const param = (css as any)[i];
		if (typeof param === 'object') {
			rules += `${name}{\n\t` + createCSSFromObject(param) + `};\n`;
		} else rules += `${name}: ${param};\n`;
	}
	return rules;
}

interface IBoxCss extends React.CSSProperties {
	[key: string]: any;
}

export interface IBoxProps {
	children?: any;
	sx?: IBoxCss;
	onClick?: (e?: MouseEvent) => void;
	element?: 'div' | 'input' | 'a';
	variant?: string;
	type?: string;
	value?: string;
	title?: string;
	style?: React.CSSProperties;
	vflex?: boolean;
	cflex?: boolean;
	scrollable?: boolean;
	id?: string;
	animate?: boolean;
	testid?: string;
}

interface IBoxDivProps {
	$sx?: React.CSSProperties;
	$animate?: boolean;
}

const boxAnimateFadeIn = keyframes`
    0% {
      opacity: .0;
      transform: translate(0,50vh);
    }
    100% {
      opacity: 1;
      transform: translate(0,0);
    }
`;

const BoxDiv = styled.div<IBoxDivProps>`
	box-sizing: border-box;
	${({ $sx }) => {
		return $sx ? createCSSFromObject($sx) : '';
	}}
	&[data-animate="true"] {
		animation: ${boxAnimateFadeIn} 0.3s cubic-bezier(0.5, 0, 0.5, 1);
	}
`;

const BoxInput = styled.input<IBoxDivProps>`
	box-sizing: border-box;
	${({ $sx }) => {
		return $sx ? createCSSFromObject($sx) : '';
	}}
`;

const setupColors = (tsx?: React.CSSProperties, theme?: ITheme) => {
	if (!theme || !theme.colors || !tsx) return;

	for (let i in tsx) {
		const value = (tsx as any)[i];

		if (typeof value === 'object') {
			setupColors(value, theme);
			continue;
		}

		if (!value || typeof value !== 'string') {
			continue;
		}

		// simple color change
		if ((theme.colors as any)[value]) {
			(tsx as any)[i] = (theme.colors as any)[value];
		} else {
			// change color in string
			for (let j in theme.colors) {
				if (value.indexOf(j) > -1) (tsx as any)[i] = value.replace(j, (theme.colors as any)[j]);
			}
		}
	}
};

export const Box = forwardRef((props: IBoxProps, ref) => {
	const theme = useTheme() as ITheme;
	const { children, sx, title, style } = props;
	const data: any = {};
	for (let i in props) {
		if (i.indexOf('data-') === 0) data[i] = (props as any)[i];
	}

	let tsx = sx;
	if (props.vflex) {
		if (!tsx) tsx = {};
		tsx.display = 'flex';
		tsx.flexDirection = 'column';
	}

	if (props.cflex) {
		if (!tsx) tsx = {};
		tsx.display = 'flex';
		tsx.flexDirection = 'column';
		tsx.alignItems = 'center';
		tsx.justifyContent = 'center';
	}

	setupColors(tsx, theme);

	if (props.element && props.element === 'input') {
		return (
			<BoxInput
				ref={ref ?? null}
				id={props.id}
				{...data}
				style={style}
				onClick={props.onClick}
				$sx={tsx}
				type={props.type}
				onChange={() => {}}
				value={props.value}
			/>
		);
	}

	let content = children;
	if (props.scrollable) {
		if (!tsx) tsx = {};
		tsx.position = 'relative';
		tsx.overflow = 'auto';
		content = <Box sx={{}}>{children}</Box>;
	}

	return (
		<BoxDiv
			data-animate={props.animate}
			ref={ref ?? null}
			id={props.id}
			title={title}
			style={style}
			{...data}
			onClick={props.onClick}
			$sx={tsx}
			data-testid={props.testid}
		>
			{content}
		</BoxDiv>
	);
});

export const HBox = (props: IBoxProps & { gap?: string; center?: boolean }) => {
	const p = { ...props };
	p.sx = { ...p.sx, display: 'flex' };
	if (p.gap) p.sx = { ...p.sx, gap: p.gap };
	if (p.center) p.sx = { ...p.sx, justifyContent: 'center', alignItems: 'center' };
	return <Box {...p} />;
};

export const VBox = forwardRef((props: IBoxProps & { gap?: string; center?: boolean }, ref) => {
	const p = { ...props };
	p.sx = { ...p.sx, display: 'flex', flexDirection: 'column' };
	if (p.gap) p.sx = { ...p.sx, gap: p.gap };
	if (p.center) p.sx = { ...p.sx, justifyContent: 'center', alignItems: 'center' };
	return <Box ref={ref} {...p} />;
});

export const isCSS = (possibleCSS: any): boolean => {
	if (typeof possibleCSS !== 'object') return false;
	const cssKeys = [
		'animation',
		'transition',
		'border',
		'borderTop',
		'borderRight',
		'borderBottom',
		'borderLeft',
		'opacity',
		'backgroundColor',
		'color',
		'border',
		'borderRadius',
		'boxShadow',
		'cursor',
		'display',
		'gridColumn',
		'gridRow',
		'gridTemplateColumns',
		'gridTemplateRows',
		'height',
		'width',
		'margin',
		'padding',
		'position',
		'top',
		'left',
		'right',
		'bottom',
		'overflow',
		'overflowX',
		'overflowY',
		'zIndex',
		'justifyContent',
		'alignItems',
		'alignContent',
		'flexDirection',
		'flexWrap',
		'flexGrow',
		'flexShrink',
		'flexBasis',
		'flex',
		'gap',
		'rowGap',
		'columnGap',
		'placeContent',
		'placeItems',
		'placeSelf',
		'textAlign',
		'textTransform',
		'textDecoration',
		'textOverflow',
		'whiteSpace',
		'overflowWrap',
		'wordBreak',
		'lineHeight',
		'fontFamily',
		'fontSize',
		'fontWeight',
		'fontStyle',
		'letterSpacing',
		'textShadow',
		'textIndent',
		'textJustify',
		'textOrientation',
		'textRendering',
		'textSizeAdjust',
		'textUnderlinePosition',
		'textTransform',
		'textWrap',
		'textEmphasis',
		'textEmphasisColor',
		'textEmphasisStyle',
		'textEmphasisPosition',
		'textEmphasisFill',
		'textEmphasisCustom',
		'textStroke',
		'textStrokeColor',
		'textStrokeWidth',
	];

	for (let i in possibleCSS) {
		if (cssKeys.indexOf(i) > -1) return true;
	}

	return false;
};
