import { useAction, useAtom } from '@reatom/npm-react';
import { VBox } from '@ui/box/Box';
import { Version } from '@ui/box/version/Version';
import { getDefaultLightTheme, GlobalTheme } from '@ui/theme/GlobalTheme';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/logger/';
import { SelfieComponent } from './components/Selfie';
import { DialogProvider, useSession } from './contexts';
import { switchCameraMode } from './models/Camera';
import { sessionIDAtom } from './models/Session';
import { BeginPage, CameraPage, ResultPage } from './pages';
import { useCheckMobileDevice } from './utils';

export type AppPage = 'begin' | 'camera' | 'result';

export function App() {
	const [currentPage, setCurrentPage] = useState<AppPage>('begin');
	const { isEmbedded, sessionStatus } = useSession();
	const [, setSessionId] = useAtom(sessionIDAtom);
	const setCameraMode = useAction(switchCameraMode);
	const url = new URL(window.location.href);
	const splitedPathname = url.pathname.split('/').filter(Boolean);

	useEffect(() => {
		if (!isEmbedded) return;
		document.body.style.backgroundColor = 'transparent';
	}, [isEmbedded]);

	useEffect(() => {
		if (!sessionStatus) return;
		if (sessionStatus === 'accepted') setCurrentPage('result');
	}, [sessionStatus]);

	// todo: use hooks to save vars
	const isMobile = useCheckMobileDevice();
	const theme = getDefaultLightTheme();

	if (theme.buttons?.primary) {
		theme.buttons.primary.fontSize = '1.2rem';
		theme.buttons.primary.width = '100%';
	}
	if (theme.buttons?.secondary) {
		theme.buttons.secondary.fontSize = '1.2rem';
		theme.buttons.secondary.width = '100%';
	}

	const navigateTo = (page: AppPage) => {
		setCurrentPage(page);
	};

	const renderCurrentPage = () => {
		if (splitedPathname.length > 1 && splitedPathname[0] === 'selfie') {
			setCameraMode('selfie');
			if (splitedPathname[1]) setSessionId(splitedPathname[1]);
			return <SelfieComponent />;
		}
		switch (currentPage) {
			case 'camera':
				return <CameraPage onNavigate={navigateTo} />;
			case 'result':
				return <ResultPage onNavigate={navigateTo} />;
			case 'begin':
			default:
				return <BeginPage onNavigate={navigateTo} />;
		}
	};

	return (
		<ErrorBoundary>
			<GlobalTheme theme={theme}>
				<DialogProvider>
					<VBox
						center
						sx={{
							alignItems: 'center',
							justifyContent: 'center',
							overflow: 'hidden',
						}}
					>
						<VBox
							center
							sx={{
								width: '100%',
								height: `calc(100dvh - ${isMobile || isEmbedded ? '0px' : '40px'})`, // viewport - (marginTop + marginBottom), only for desktop
								// height: '100%',
								position: 'relative',
								maxWidth: isMobile || isEmbedded ? undefined : '600px',
								overflowY: 'hidden',
								boxShadow: isMobile || isEmbedded ? undefined : '0px 0px 40px rgba(0,0,0,.1)',
								display: 'flex',
								flexDirection: 'column',
								...(isEmbedded
									? {}
									: {
											margin: isMobile || isEmbedded ? undefined : '20px',
											borderRadius: isMobile || isEmbedded ? undefined : '20px',
										}),
							}}
						>
							{!isEmbedded && <Header />}
							{renderCurrentPage()}
						</VBox>
						<Version />
					</VBox>
				</DialogProvider>
			</GlobalTheme>
		</ErrorBoundary>
	);
}
