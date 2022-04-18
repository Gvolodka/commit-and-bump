module.exports = {
  types: [
    { type: 'feature', section: 'Features', hidden: false },
    { type: 'bugfix', section: 'Bug Fixes', hidden: false }
  ],
  packageFiles: ['package.json'],
  bumpFiles: [
    'package.json',
    'package-lock.json',
  ],
  infile: 'CHANGELOG.md',
  firstRelease: false,
  sign: false,
  noVerify: false,
  'commit-all': false,
  commitAll: false,
  silent: false,
  tagPrefix: 'rc',
  dryRun: false,
  gitTagFallback: true,
  preset: require.resolve('conventional-changelog-conventionalcommits'),
  header: '# Changelog\n' +
    '\n' +
    'All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n',
  preMajor: false,
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
  userUrlFormat: '{{host}}/{{user}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  issuePrefixes: ['#'],
};
