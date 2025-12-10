import { useSession } from '@contexts/SessionContext';
import { HBox } from '@ui/box/Box';
import Button from '@ui/button/Button';
import { IconAmLogo } from '@ui/icons';
import { Select } from '@ui/select/Select';
import Spacer from '@ui/spacer/Spacer';
import { i18n, Language, Languages, REQ_CHANGE_LANGUAGE, S_CURRENT_LANGUAGE, SUPPORTED_LANGUAGES } from 'src/utils/i18n';

function getHeight(url: string | null): number {
	if (!url) return 0;

	if (url.includes('vibo.tips')) return 20;
	if (url.includes('amazing.money')) return 32;

	return 0;
}

export const Header = () => {
	const { isEmbedded, targetOrigin, isInitLoading, logoUrl } = useSession();
	const currentLangCode = S_CURRENT_LANGUAGE.use() || i18n.language;
	const currentLang = SUPPORTED_LANGUAGES.find(({ code }) => code === currentLangCode) || SUPPORTED_LANGUAGES[0];
	const changeLanguage = (lang: Languages['code']) => {
		REQ_CHANGE_LANGUAGE.request(lang);
	};

	return (
		<HBox
			sx={{
				padding: '16px',
				width: '100%',
				backgroundColor: '#ffffff',
				borderBottom: '1px solid rgba(234, 239, 240, 1)',
				alignItems: 'center',
			}}
		>
			{!isInitLoading && (logoUrl ? <img src={logoUrl} alt="Logo" height={getHeight(logoUrl)} /> : <IconAmLogo />)}

			<Spacer grow minHeight="44px" />

			{!isInitLoading &&
				(isEmbedded ? (
					<Button
						size="small"
						variant="secondarySmall"
						onClick={() => {
							window.parent.postMessage(
								{ type: 'BUTTON_CLOSE_CLICK' },
								import.meta.env.VITE_LOCAL_CLIENT ? 'http://localhost:3000' : (targetOrigin ?? ''),
							);
						}}
					>
						Back
					</Button>
				) : (
					<Select<Language>
						values={[...SUPPORTED_LANGUAGES]}
						value={currentLang}
						sx={{ borderColor: '#dadada', borderRadius: '8px' }}
						onChange={(value) => changeLanguage(value.code)}
					/>
				))}
		</HBox>
	);
};
