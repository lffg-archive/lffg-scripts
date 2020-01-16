const { invalidScript } = require('./utils/messages');
const { isValidScript, getScriptByName } = require('./utils/scripts');

/**
 * @param {string} scriptName
 * @param {string[]} args
 * @return {void}
 */
function run(scriptName, args) {
  if (!scriptName || !isValidScript(scriptName)) {
    return console.error(invalidScript(scriptName));
  }

  const { run } = getScriptByName(scriptName);
  run(args);
}

module.exports = {
  run
};
