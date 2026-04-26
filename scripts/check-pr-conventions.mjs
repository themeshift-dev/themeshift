const baseBranch = process.env.PR_BASE_BRANCH ?? '';
const headBranch = process.env.PR_HEAD_BRANCH ?? '';
const prTitle = process.env.PR_TITLE ?? '';

const branchPattern =
  /^(feat|fix|chore)\/(?:[A-Z]+-[0-9]+-)?[a-z0-9][a-z0-9-]*$/;
const conventionalTitlePattern =
  /^(feat|fix|docs|chore|refactor|test|build|ci|perf|style)(\([a-z0-9-]+\))?!?: .+$/;

if (baseBranch !== 'develop') {
  console.log(`Skipping PR convention checks for base branch: ${baseBranch}`);
  process.exit(0);
}

if (headBranch === 'main') {
  console.log('Skipping PR branch name check for main -> develop sync PR.');
  process.exit(0);
}

if (!branchPattern.test(headBranch)) {
  throw new Error(
    `Invalid branch name "${headBranch}". Use feat/short-description, fix/short-description, chore/short-description, feat/KEY-123-short-description, fix/KEY-123-short-description, or chore/KEY-123-short-description.`
  );
}

if (!conventionalTitlePattern.test(prTitle)) {
  throw new Error(
    `Invalid PR title "${prTitle}". Use a Conventional Commit title, for example "feat(ui): add loading state".`
  );
}

console.log('PR branch name and title follow the release conventions.');
