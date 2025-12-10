import {createGlobalStyle, ThemeProvider} from "styled-components";
import {getDefaultButtons, TButtons} from "../button/Button";
import {
	getDefaultTableDarkTheme,
	getDefaultTableLightTheme,
} from "../table/Table";

export type TTypos = typeof getDefaultTypos;

export type TTypoVariant = keyof TTypos;
export type TDefaultLightThemeColors = typeof DefaultLightThemeColors;

export interface ITheme {
	name: string;
	typo?: TTypos;
	buttons?: TButtons;
	table?: typeof getDefaultTableLightTheme;
	colors: TDefaultLightThemeColors;
}

interface GlobalThemeProps {
	theme?: ITheme;
	children?: any;
}

export const DefaultLightThemeColors = {
	// document
	backgroundPrimary: "#EEF0F2",

	// panels
	panelBackgroundPrimary: "#FFFFFF",
	panelDividerBackgroundColor:
		"linear-gradient(0deg, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.1) 50%)",
	panelHeadBackgroundColor: "rgba(0, 0, 0, 0.05)",

	// input
	inputBackgroundPrimary: "#FFFFFF",
	inputBorderPrimary: "rgba(43, 33, 79, 0.3)",
	inputBorderSecondary: "#101A24",

	// text
	textPrimary: "#14171F",
	textSecondary: "#848799",

	// Buttons
	buttonBackgroundPrimary: "#101A24",
	buttonBackgroundSecondary: "#848799",
	buttonTextPrimary: "#FFFFFF",
	buttonBackgroundPrimaryHover: "#1d2228",
	buttonTextSecondary: "#14171F",
};

export const DefaultDarkThemeColors: TDefaultLightThemeColors = {
	backgroundPrimary: "#19141f",

	inputBackgroundPrimary: "rgba(0,0,0,.1)",
	inputBorderPrimary: "rgba(255, 255, 255, 0.1)",
	inputBorderSecondary: "#0b6df5",

	panelBackgroundPrimary: "#231d2b",
	panelHeadBackgroundColor: "rgba(0, 0, 0, 0.1)",
	panelDividerBackgroundColor:
		"linear-gradient(0deg, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.8) 50%)",

	textPrimary: "#FFFFFF",
	textSecondary: "blue",
	buttonBackgroundPrimary: "#0b6df5",
	buttonBackgroundSecondary: "orange",
	buttonTextPrimary: "yellow",
	buttonBackgroundPrimaryHover: "purple",
	buttonTextSecondary: "pink",
};

export const getDefaultTypos = {
	head: {
		fontSize: "1.7rem",
		fontWeight: 600,
		color: "textPrimary",
		// marginBottom:"10px",
		display: "inline",
	},
	headMedium: {
		fontSize: "1.15rem",
		fontWeight: 500,
		color: "textPrimary",
		// marginBottom:"10px",
		display: "inline",
	},
	text: {
		fontSize: "1rem",
		fontWeight: 400,
		color: "textPrimary",
		display: "inline",
	},
	medium: {
		fontSize: ".88rem",
		fontWeight: 400,
		color: "textPrimary",
		display: "inline",
	},
	caption: {
		fontSize: ".75rem",
		fontWeight: 400,
		color: "textPrimary",
		display: "inline",
		opacity: 0.6,
	},
	small: {
		fontSize: ".6rem",
		fontWeight: 400,
		color: "textPrimary",
		display: "inline",
	},
};

export const isLightColor = (hex: string): boolean => {
	hex = hex.replace(/^#/, "");

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

	return brightness > 128;
};

export const getDefaultLightTheme = (): ITheme => {
	return {
		name: "light",
		colors: JSON.parse(JSON.stringify(DefaultLightThemeColors)),
		typo: JSON.parse(JSON.stringify(getDefaultTypos)),
		buttons: JSON.parse(JSON.stringify(getDefaultButtons)),
		table: JSON.parse(JSON.stringify(getDefaultTableLightTheme)),
	};
};

export const getDefaultDarkTheme = (): ITheme => {
	return {
		name: "dark",
		colors: JSON.parse(JSON.stringify(DefaultDarkThemeColors)),
		typo: JSON.parse(JSON.stringify(getDefaultTypos)),
		buttons: JSON.parse(JSON.stringify(getDefaultButtons)),
		table: JSON.parse(JSON.stringify(getDefaultTableDarkTheme)),
	};
};

const BaseStyle = createGlobalStyle`
	@font-face {
		font-family: 'Euclid';
		src:
			url('/Euclid Circular B Regular.woff2') format('woff2'),
			url('/Euclid Circular B Regular.woff') format('woff');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Euclid';
		src:
			url('/Euclid Circular B Bold.woff2') format('woff2'),
			url('/Euclid Circular B Bold.woff') format('woff');
		font-weight: 700;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Euclid';
		src:
			url('/Euclid Circular B Light.woff2') format('woff2'),
			url('/Euclid Circular B Light.woff') format('woff');
		font-weight: 300;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Euclid';
		src:
			url('/Euclid Circular B Medium.woff2') format('woff2'),
			url('/Euclid Circular B Medium.woff') format('woff');
		font-weight: 500;
		font-style: normal;
		font-display: swap;
	}

	@font-face {
		font-family: 'Euclid';
		src:
			url('/Euclid Circular B SemiBold.woff2') format('woff2'),
			url('/Euclid Circular B SemiBold.woff') format('woff');
		font-weight: 600;
		font-style: normal;
		font-display: swap;
	}

	body{
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
    	-webkit-font-smoothing: antialiased;
    	-moz-osx-font-smoothing: grayscale;
		margin: 0;
		padding: 0;
		color:${({theme}: {theme: ITheme}) => theme.colors.textPrimary};
		background-color:${({theme}: {theme: ITheme}) =>
			theme.colors.backgroundPrimary};
		
	}

	*{
		box-sizing: border-box;
	}
	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	
	::-webkit-scrollbar-track {
		background-color:rgba(0,0,0,.2);
		border-radius: 3px;
	}
	
	::-webkit-scrollbar-thumb {
		background-color:rgba(0,0,0,.3);
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color:rgba(0,0,0,1);
	}
`;

const reparseColors = (colors: TDefaultLightThemeColors) => {
	for (let i in colors) {
		const value = (colors as any)[i];
		if ((colors as any)[value]) (colors as any)[i] = (colors as any)[value];
	}
};

const parseThemeColors = (
	theme: ITheme,
	colors: TDefaultLightThemeColors
): ITheme => {
	// recursively parse theme
	for (let i in theme) {
		if (i === "colors") continue;

		if (typeof (theme as any)[i] === "object") {
			(theme as any)[i] = parseThemeColors((theme as any)[i], colors);
			continue;
		}

		if (typeof (theme as any)[i] === "string") {
			const value = (theme as any)[i];
			if ((colors as any)[value]) {
				(theme as any)[i] = (colors as any)[value];
			} else {
				// find color in value
				for (let j in colors) {
					if (value.indexOf(j) > -1) {
						(theme as any)[i] = value.replace(
							j,
							(colors as any)[j]
						);
					}
				}
			}
		}
	}
	return theme;
};

const parseTheme = (theme: ITheme): ITheme => {
	// reparse colors
	reparseColors(theme.colors);
	// recursively parse theme
	parseThemeColors(theme, theme.colors);
	return theme;
};

export const GlobalTheme = ({theme, children}: GlobalThemeProps) => {
	return (
		<ThemeProvider theme={parseTheme(theme ?? getDefaultLightTheme())}>
			<BaseStyle theme={theme ?? getDefaultLightTheme()} />
			{children}
		</ThemeProvider>
	);
};
