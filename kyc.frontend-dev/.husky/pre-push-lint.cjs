const { spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

console.log('\nStarting ESLint check (pre-push hook)...');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const lintProcess = spawnSync(npmCommand, ['run', 'lint'], {
	cwd: projectRoot,
	stdio: 'pipe',
	encoding: 'utf-8',
});

if (lintProcess.status !== 0) {
	// ESLint check failed
	console.error('\n🚫 ESLint check FAILED!\n');
	if (lintProcess.stdout) {
		console.error('--- Output ---');
		console.error(lintProcess.stdout.trim());
	}
	if (lintProcess.stderr) {
		console.error('--- Errors ---');
		console.error(lintProcess.stderr.trim());
	}
	console.error('\nPush aborted due to ESLint errors.\n');
	console.error('\nPlease fix the above errors and change exit code to 1\n');
	process.exit(0);
} else {
	// ESLint check passed
	console.log('✅ ESLint check passed.\n');
	process.exit(0);
}
