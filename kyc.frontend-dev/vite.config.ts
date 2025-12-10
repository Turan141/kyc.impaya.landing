import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { qrcode } from 'vite-plugin-qrcode';
// import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		// basicSsl({
		// 	certDir: '/Users/sorokin/.ssl_certs',
		// }),
		qrcode(),
	],
	resolve: {
		alias: {
			'@ui': path.resolve(__dirname, 'src', 'components', 'ui'),
			'@contexts': path.resolve(__dirname, 'src', 'contexts'),
		},
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
		dedupe: ['react', 'react-dom'], // Дедупликация React
	},
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
		'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.npm_package_name),
		'import.meta.env.VITE_LOCAL_CLIENT': process.env.VITE_LOCAL_CLIENT === 'true',
	},
	server: {
		open: true,
		host: true,
		fs: {
			allow: ['..'],
		},
		/* https: {
      key: fs.readFileSync(path.resolve(__dirname,"ssl","bloom",'192.168.8.133-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname,"ssl","bloom",'192.168.8.133.pem')),
      //key: fs.readFileSync(path.resolve(__dirname,"ssl","bloom_office",'172.16.0.105-key.pem')),
      //cert: fs.readFileSync(path.resolve(__dirname,"ssl","bloom_office",'172.16.0.105.pem'))
    },
    host:true,
    //host:'192.168.1.40',*/
		port: 3003,
		watch: {
			ignored: ['!ui/**'],
		},
	},
});
