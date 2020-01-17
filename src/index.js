const { errorForError } = require('./utils/chalk');
const { throwIfDev } = require('./utils/env');
const { invalidScript } = require('./utils/messages');
const { isValidScript, getScriptByName } = require('./utils/scripts');

/**
 * @param {{ scriptName: string, args: string[] }} args |
 * @return {void}
 */
function run({ scriptName, args }) {
  try {
    if (!scriptName || !isValidScript(scriptName)) {
      return console.error(invalidScript(scriptName));
    }

    const { run } = getScriptByName(scriptName);
    run(args);
  } catch (error) {
    console.error(errorForError(throwIfDev(error)));
  }
}

module.exports = {
  run
};
