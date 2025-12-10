#!/usr/bin/env node

import { execSync } from 'child_process';
import * as clack from '@clack/prompts';
import { setTimeout } from 'timers/promises';

// Production branches: cannot be used as target (source), but can be deploy destination
const PRODUCTION_BRANCHES = ['main'] as const;

// Manual entry option label
const MANUAL_ENTRY = 'Enter manually' as const;

interface BranchOptions {
	[key: string]: string;
}

interface PromptAnswers {
	targetBranch: string;
	targetBranchManual: string | null;
	baseBranch: string;
	baseBranchManual: string | null;
	versionBump: boolean;
	branchCheck: boolean;
	autoMerge: boolean;
	chainDeploy: boolean;
	chainDeployBranch: string | null;
	chainAutoMerge: boolean;
}

interface PRStatus {
	state: string;
	mergeable: string;
	mergedAt: string | null;
	number: number;
	url: string;
}

interface WorkflowRun {
	status: string;
	conclusion: string | null;
	name: string;
}

/**
 * Execute shell command and return trimmed output
 */
function exec(command: string): string | null {
	try {
		return execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
	} catch (error) {
		console.error(`[Execute command] '${command}'`, error);
		return null;
	}
}

/**
 * Get current git branch name
 */
function getCurrentBranch(): string | null {
	return exec('git branch --show-current');
}

/**
 * Get list of local branches, filtered by excluded list
 */
function getLocalBranches(exclude: readonly string[] = []): string[] {
	const output = exec('git branch');
	if (!output) return [];

	return output
		.split('\n')
		.map((branch) => branch.replace(/^\*?\s+/, '').trim())
		.filter((branch) => branch && !exclude.includes(branch));
}

/**
 * Get list of remote branches, cleaned from origin/ prefix
 */
function getRemoteBranches(): string[] {
	// Prune deleted remote branches first
	exec('git fetch --prune origin');

	const output = exec('git branch -r');
	if (!output) return [];

	return output
		.split('\n')
		.map((branch) => branch.trim())
		.filter((branch) => branch && !branch.includes('HEAD'))
		.map((branch) => branch.replace(/^origin\//, ''))
		.filter((branch, index, self) => self.indexOf(branch) === index); // unique
}

/**
 * Check if gh CLI is available
 */
function checkGhCLI(): boolean {
	const ghPath = exec('which gh');
	return !!ghPath;
}

/**
 * Copy text to clipboard (macOS)
 */
function copyToClipboard(text: string): boolean {
	try {
		execSync('pbcopy', { input: text, encoding: 'utf-8' });
		return true;
	} catch {
		return false;
	}
}

/**
 * Get PR status using gh CLI
 */
function getPRStatus(prNumber: string): PRStatus | null {
	try {
		const output = exec(`gh pr view ${prNumber} --json state,mergeable,mergedAt,number,url`);
		if (!output) return null;
		return JSON.parse(output) as PRStatus;
	} catch (error) {
		console.error('Error getting PR status:', error);
		return null;
	}
}

/**
 * Get workflow runs for a specific branch
 */
function getWorkflowRuns(branch: string): WorkflowRun[] | null {
	try {
		const output = exec(`gh run list --branch ${branch} --limit 10 --json status,conclusion,name`);
		if (!output) return null;
		return JSON.parse(output) as WorkflowRun[];
	} catch (error) {
		console.error('Error getting workflow runs:', error);
		return null;
	}
}

/**
 * Extract PR number by finding PR for target branch
 */
async function extractPRNumber(targetBranch: string, baseBranch: string): Promise<string | null> {
	try {
		console.log(`Looking for PR: ${targetBranch} -> ${baseBranch}`);

		const MAX_ATTEMPTS = 20;
		const INITIAL_DELAY = 30000;
		const RETRY_DELAY = 15000;

		// Initial wait for workflow to create PR
		await setTimeout(INITIAL_DELAY);

		for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
			console.log(`Attempt ${attempt}/${MAX_ATTEMPTS}...`);

			const output = exec(`gh pr list --head ${targetBranch} --base ${baseBranch} --json number --limit 1`);
			if (!output) {
				if (attempt < MAX_ATTEMPTS) {
					await setTimeout(RETRY_DELAY);
					continue;
				}
				return null;
			}

			const prs = JSON.parse(output);
			if (prs && prs.length > 0) {
				console.log(`Found PR #${prs[0].number}`);
				return String(prs[0].number);
			}

			if (attempt < MAX_ATTEMPTS) {
				await setTimeout(RETRY_DELAY);
			}
		}

		console.log('PR not found after all attempts');
		return null;
	} catch (error) {
		console.error('Error extracting PR number:', error);
		return null;
	}
}

/**
 * Monitor PR and create next PR when merged
 */
async function monitorPRAndCreateNext(
	targetBranch: string,
	baseBranch: string,
	deployBranch: string,
	autoMerge: boolean,
): Promise<void> {
	const spinner = clack.spinner();
	spinner.start('Waiting for PR to be created...');

	const prNumber = await extractPRNumber(targetBranch, baseBranch);
	if (!prNumber) {
		spinner.stop('Failed to get PR number');
		clack.note('Could not find PR. Check GitHub Actions for PR status.', 'Warning');
		return;
	}

	spinner.stop(`Monitoring PR #${prNumber}`);

	clack.note(
		`PR #${prNumber}: ${targetBranch} -> ${baseBranch}\n` +
			`Waiting for merge and workflows completion...\n` +
			`Will create: ${baseBranch} -> ${deployBranch}`,
		'Chain Deploy Monitor',
	);

	const POLL_INTERVAL = 15000;
	const MAX_POLL_TIME = 1800000;
	const startTime = Date.now();

	spinner.start('Waiting for PR to be merged...');

	while (Date.now() - startTime < MAX_POLL_TIME) {
		await setTimeout(POLL_INTERVAL);

		const prStatus = getPRStatus(prNumber);
		if (!prStatus) {
			continue;
		}

		if (prStatus.state === 'MERGED') {
			spinner.stop('PR merged successfully');

			spinner.start('Waiting for workflows to complete...');
			await setTimeout(5000);

			let allWorkflowsComplete = false;
			const workflowStartTime = Date.now();
			const WORKFLOW_TIMEOUT = 600000;

			while (Date.now() - workflowStartTime < WORKFLOW_TIMEOUT) {
				await setTimeout(10000);

				const workflows = getWorkflowRuns(baseBranch);
				if (!workflows || workflows.length === 0) {
					continue;
				}

				const relevantWorkflows = workflows.filter((w) => w.status === 'in_progress' || w.status === 'queued' || w.status === 'completed');

				if (relevantWorkflows.length === 0) {
					continue;
				}

				const inProgress = relevantWorkflows.filter((w) => w.status === 'in_progress' || w.status === 'queued');
				const completed = relevantWorkflows.filter((w) => w.status === 'completed');
				const failed = completed.filter((w) => w.conclusion !== 'success' && w.conclusion !== 'skipped');

				if (failed.length > 0) {
					spinner.stop('Some workflows failed');
					clack.note(`Failed workflows:\n${failed.map((w) => `  - ${w.name}: ${w.conclusion}`).join('\n')}`, 'Warning');

					const shouldContinue = await clack.confirm({
						message: 'Some workflows failed. Continue with deploy PR creation?',
						initialValue: false,
					});

					if (!shouldContinue || clack.isCancel(shouldContinue)) {
						clack.cancel('Deploy PR creation cancelled');
						return;
					}
					allWorkflowsComplete = true;
					break;
				}

				if (inProgress.length === 0 && completed.length > 0) {
					allWorkflowsComplete = true;
					break;
				}

				spinner.message(`Waiting for ${inProgress.length} workflow(s) to complete...`);
			}

			if (!allWorkflowsComplete) {
				spinner.stop('Workflow timeout');
				clack.note('Workflows did not complete within timeout. You can create the deploy PR manually.', 'Timeout');
				return;
			}

			spinner.stop('All workflows completed');

			spinner.start('Creating deploy PR...');

			try {
				const command = [
					'gh workflow run create_pr.yml',
					`-f target_branch=${baseBranch}`,
					`-f base_branch=${deployBranch}`,
					`-f version_bump=false`,
					`-f branch_check=false`,
					`-f auto_merge=${autoMerge}`,
				].join(' ');

				execSync(command, { encoding: 'utf-8', stdio: 'inherit' });

				spinner.stop('Deploy PR workflow triggered');

				await setTimeout(2000);

				clack.note(
					`Deploy PR: ${baseBranch} -> ${deployBranch}\n` +
						`Auto-merge: ${autoMerge ? 'enabled' : 'disabled'}\n\n` +
						'Check workflow status:\n' +
						'  gh run list --workflow=create_pr.yml --limit=1\n' +
						'Or visit: https://github.com/Impaya/kyc.frontend/actions',
					'Deploy PR Created',
				);

				clack.outro('Chain deploy completed successfully');
			} catch (error) {
				spinner.stop('Failed to create deploy PR');
				const errorMessage = error instanceof Error ? error.message : String(error);
				clack.outro(`Error: ${errorMessage}`);
			}

			return;
		} else if (prStatus.state === 'CLOSED') {
			spinner.stop('PR was closed without merging');
			clack.cancel('Chain deploy cancelled - PR was closed');
			return;
		}

		spinner.message(`PR status: ${prStatus.state} | Mergeable: ${prStatus.mergeable}`);
	}

	spinner.stop('Monitoring timeout');
	clack.note('PR monitoring timed out after 30 minutes. You can create the deploy PR manually.', 'Timeout');
}

/**
 * Main function
 */
async function main(): Promise<void> {
	global.console.clear();

	clack.intro('Create Pull Request');

	// Check prerequisites
	if (!checkGhCLI()) {
		clack.outro('Error: GitHub CLI (gh) is not installed. Install it from https://cli.github.com/');
		process.exit(1);
	}

	const currentBranch = getCurrentBranch();
	if (!currentBranch) {
		clack.outro('Error: Not in a git repository or unable to determine current branch');
		process.exit(1);
	}

	// Get branches
	const localBranches = getLocalBranches(PRODUCTION_BRANCHES);
	const remoteBranches = getRemoteBranches();

	if (localBranches.length === 0) {
		clack.outro('Error: No valid local branches found for target');
		process.exit(1);
	}

	if (remoteBranches.length === 0) {
		clack.outro('Error: No remote branches found for base');
		process.exit(1);
	}

	// Prepare options for target branch
	const targetOptions: BranchOptions = localBranches.reduce((acc, branch) => {
		acc[branch] = branch;
		return acc;
	}, {} as BranchOptions);
	targetOptions[MANUAL_ENTRY] = MANUAL_ENTRY;

	// Prepare options for base branch
	const baseOptions: BranchOptions = remoteBranches.reduce((acc, branch) => {
		acc[branch] = branch;
		return acc;
	}, {} as BranchOptions);
	baseOptions[MANUAL_ENTRY] = MANUAL_ENTRY;

	// Determine initial value for target
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const targetInitialValue = !PRODUCTION_BRANCHES.includes(currentBranch as any) ? currentBranch : localBranches[0];

	// Collect inputs
	const answers = await clack.group<PromptAnswers>(
		{
			targetBranch: () =>
				clack.select({
					message: 'Select target branch (branch to merge FROM)',
					options: Object.entries(targetOptions).map(([value, label]) => ({ value, label })),
					initialValue: targetInitialValue,
				}) as Promise<string>,

			targetBranchManual: ({ results }) => {
				if (results.targetBranch !== MANUAL_ENTRY) return Promise.resolve(null);
				return clack.text({
					message: 'Enter target branch name',
					placeholder: 'feature-branch',
					validate: (value) => {
						if (!value) return 'Branch name is required';
						return undefined;
					},
				}) as Promise<string>;
			},

			baseBranch: () =>
				clack.select({
					message: 'Select base branch (branch to merge INTO)',
					options: Object.entries(baseOptions).map(([value, label]) => ({ value, label })),
					initialValue: 'dev',
				}) as Promise<string>,

			baseBranchManual: ({ results }) => {
				if (results.baseBranch !== MANUAL_ENTRY) return Promise.resolve(null);
				return clack.text({
					message: 'Enter base branch name',
					placeholder: 'dev',
					validate: (value) => {
						if (!value) return 'Branch name is required';
						return undefined;
					},
				}) as Promise<string>;
			},

			versionBump: () =>
				clack.confirm({
					message: 'Bump version after merge?',
					initialValue: true,
				}) as Promise<boolean>,

			branchCheck: () =>
				clack.confirm({
					message: 'Check branch freshness?',
					initialValue: true,
				}) as Promise<boolean>,

			autoMerge: () =>
				clack.confirm({
					message: 'Enable auto-merge?',
					initialValue: true,
				}) as Promise<boolean>,

			chainDeploy: ({ results }) => {
				if (results.baseBranch !== 'dev' && results.baseBranchManual !== 'dev') {
					return Promise.resolve(false);
				}
				return clack.confirm({
					message: 'Create chain to deploy branch after merge?',
					initialValue: false,
				}) as Promise<boolean>;
			},

			chainDeployBranch: ({ results }) => {
				if (!results.chainDeploy) return Promise.resolve(null);

				const deployOptions: BranchOptions = PRODUCTION_BRANCHES.reduce((acc, branch) => {
					acc[branch] = branch;
					return acc;
				}, {} as BranchOptions);

				return clack.select({
					message: 'Select deploy branch for chain PR',
					options: Object.entries(deployOptions).map(([value, label]) => ({ value, label })),
					initialValue: PRODUCTION_BRANCHES[0],
				}) as Promise<string>;
			},

			chainAutoMerge: ({ results }) => {
				if (!results.chainDeploy) return Promise.resolve(false);
				return clack.confirm({
					message: 'Enable auto-merge for deploy PR?',
					initialValue: true,
				}) as Promise<boolean>;
			},
		},
		{
			onCancel: () => {
				clack.cancel('Operation cancelled');
				process.exit(0);
			},
		},
	);

	// Determine final branch names
	const finalTargetBranch = answers.targetBranch === MANUAL_ENTRY ? answers.targetBranchManual : answers.targetBranch;

	const finalBaseBranch = answers.baseBranch === MANUAL_ENTRY ? answers.baseBranchManual : answers.baseBranch;

	// Show summary
	const summaryLines = [
		`Target: ${finalTargetBranch}`,
		`Base: ${finalBaseBranch}`,
		`Version bump: ${answers.versionBump}`,
		`Branch check: ${answers.branchCheck}`,
		`Auto-merge: ${answers.autoMerge}`,
	];

	if (answers.chainDeploy && answers.chainDeployBranch) {
		summaryLines.push('');
		summaryLines.push('Chain Deploy:');
		summaryLines.push(`  Deploy branch: ${answers.chainDeployBranch}`);
		summaryLines.push(`  Auto-merge: ${answers.chainAutoMerge}`);
	}

	clack.note(summaryLines.join('\n'), 'Pull Request Configuration');

	// Final confirmation
	const shouldContinue = await clack.confirm({
		message: 'Create pull request with these settings?',
		initialValue: true,
	});

	if (!shouldContinue || clack.isCancel(shouldContinue)) {
		clack.cancel('Operation cancelled');
		process.exit(0);
	}

	// Execute workflow
	const spinner = clack.spinner();
	spinner.start('Triggering GitHub workflow');

	try {
		const command = [
			'gh workflow run create_pr.yml',
			`-f target_branch=${finalTargetBranch}`,
			`-f base_branch=${finalBaseBranch}`,
			`-f version_bump=${answers.versionBump}`,
			`-f branch_check=${answers.branchCheck}`,
			`-f auto_merge=${answers.autoMerge}`,
		].join(' ');

		execSync(command, { encoding: 'utf-8', stdio: 'inherit' });

		spinner.stop('Workflow triggered successfully');

		// Give GitHub a moment to register the workflow
		await setTimeout(2000);

		// Try to get the workflow run URL
		const ghCommand = 'gh run list --workflow=create_pr.yml --limit=1';
		const copied = copyToClipboard(ghCommand);

		clack.note(
			'View workflow status:\n' +
				`  ${ghCommand}${copied ? ' (copied to clipboard)' : ''}\n` +
				'Or visit: https://github.com/Impaya/kyc.frontend/actions',
			'Next steps',
		);

		if (answers.chainDeploy && answers.chainDeployBranch && finalBaseBranch === 'dev') {
			clack.outro('First PR workflow triggered! Starting chain deploy monitor...');

			await monitorPRAndCreateNext(finalTargetBranch!, finalBaseBranch, answers.chainDeployBranch, answers.chainAutoMerge);
		} else {
			clack.outro('Pull request workflow has been triggered!');
		}
	} catch (error) {
		spinner.stop('Failed to trigger workflow');
		const errorMessage = error instanceof Error ? error.message : String(error);
		clack.outro(`Error: ${errorMessage}`);
		process.exit(1);
	}
}

// Run
main().catch((error) => {
	const errorMessage = error instanceof Error ? error.message : String(error);
	clack.outro(`Unexpected error: ${errorMessage}`);
	process.exit(1);
});
