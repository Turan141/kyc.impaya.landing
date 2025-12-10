const { spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

console.log('\nStarting TypeScript type check (pre-push hook)...');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const typeCheckProcess = spawnSync(npmCommand, ['run', 'ts-check'], {
	cwd: projectRoot,
	stdio: 'pipe',
	encoding: 'utf-8',
});

if (typeCheckProcess.status !== 0) {
	// TypeScript check failed
	console.error('\n🚫 TypeScript check FAILED!\n');
	if (typeCheckProcess.stdout) {
		console.error('--- Output ---');
		console.error(typeCheckProcess.stdout.trim());
	}
	if (typeCheckProcess.stderr) {
		console.error('--- Errors ---');
		console.error(typeCheckProcess.stderr.trim());
	}
	console.error('\nPush aborted due to TypeScript errors.\n');
	process.exit(1);
	// process.exit(1);
} else {
	// TypeScript check passed
	console.log('✅ TypeScript check passed.\n');
	process.exit(0);
}
