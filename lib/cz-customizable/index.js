const CZ_CONFIG_NAME = '.cz-config.js';
const editor = require('editor');
const temp = require('temp').track();
const fs = require('fs');
const log = require('cz-customizable/logger');
const buildCommit = require('cz-customizable/buildCommit');

module.exports = {
  prompter(cz, commit) {
    const config = require(`../../${CZ_CONFIG_NAME}`);
    config.subjectLimit = config.subjectLimit || 100;
    log.info('All lines except first will be wrapped after 100 characters.');

    const questions = require('cz-customizable/questions').getQuestions(config, cz);

    cz.prompt(questions).then(answers => {
      if (answers.confirmCommit === 'edit') {
        temp.open(null, (err, info) => {
          if (!err) {
            fs.writeSync(info.fd, buildCommit(answers, config));
            fs.close(info.fd, () => {
              editor(info.path, code => {
                if (code === 0) {
                  const commitStr = fs.readFileSync(info.path, {
                    encoding: 'utf8',
                  });
                  commit(commitStr);
                } else {
                  log.info(`Editor returned non zero value. Commit message was:\n${buildCommit(answers, config)}`);
                }
              });
            });
          }
        });
      } else if (answers.confirmCommit === 'yes') {
        commit(buildCommit(answers, config));
      } else {
        log.info('Commit has been canceled.');
      }
    });
  },
};
