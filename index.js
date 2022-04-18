#!/usr/bin/env node

const { execSync } = require('child_process');
const inquirer = require('inquirer');
const app = require('./lib/cz-customizable/index');

const standardVersion = require('./lib/standard-version/index');
const config = require('./standard-version-config.js');

console.warn(
  '\x1b[33m%s\x1b[0m',
  `----Attention!----

After bumping the version, non-staged changes will be added to the commit.
Stash or commit changes before bumping the version.
`,
);

const execSyncOptions = { stdio: [0, 1, 2] };

const commit = commitMessage => {
  // The original logic from node_modules/cz-customizable/standalone.js.
  try {
    execSync(`git commit -m "${commitMessage}"`, execSyncOptions);
  } catch (error) {
    console.error('>>> ERROR', error.error);
    return;
  }

  // Version update logic after a commit.
  inquirer
    .prompt([{
      type: 'list',
      name: 'bumpType',
      message: 'Do you want to bump the version?',
      choices: ['Yes', 'No', 'RC'],
      filter(val) {
        return val.toLowerCase();
      },
    }])
    .then(({ bumpType }) => {
      let command = 'standard-version --skip.commit --skip.tag --skip.changelog';
      switch (bumpType) {
        case 'yes':
          break;
        // Updating the release candidate version.
        case 'rc':
          command += ` --prerelease rc`;
          break;
        // Not updating version. Finishing the script.
        default:
          return;
      }

      // Updating the version.
      standardVersion(config)
        .then(() => {
          // Adding an updated version to an earlier commit.
          execSync(`git add .`, execSyncOptions);
          execSync(`git commit --amend --no-edit`, execSyncOptions);
        })
        .catch(() => {
          process.exit(1)
        })
    })
};

app.prompter(inquirer, commit);
