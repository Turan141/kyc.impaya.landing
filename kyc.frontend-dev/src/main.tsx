import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './utils/i18n.ts';
import { reatomContext } from '@reatom/npm-react';
import { SessionProvider } from '@contexts/SessionContext.tsx';
import { getLanguageManager } from './utils/i18n.ts';
import en from './utils/en.json';
import { ctx } from './models';

// if (import.meta.env.DEV) {
// 	connectLogger(ctx);
// }

const root = createRoot(document.getElementById('root') as HTMLElement);
const languageManager = getLanguageManager(import.meta.env.VITE_APP_VERSION ?? '1.0.0');

languageManager.init(en).then(() => {
	root.render(
		<reatomContext.Provider value={ctx}>
			<SessionProvider>
				<App />
			</SessionProvider>
		</reatomContext.Provider>,
	);
});
