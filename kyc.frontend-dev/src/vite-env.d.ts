/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_VERSION: string;
	readonly VITE_APP_NAME: string;
	readonly VITE_LOCAL_CLIENT: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
