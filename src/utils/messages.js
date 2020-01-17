const { quoteAndUnderline } = require('./chalk');
const { joinList } = require('./formatter');
const { getScriptNames } = require('./scripts');

/**
 * @param {string | undefined} scriptName
 * @return {string}
 */
function invalidScript(scriptName = undefined) {
  const availableScripts = joinList(getScriptNames(), quoteAndUnderline);

  return scriptName
    ? `The script "${scriptName}" does not exist. The valid ones are: ${availableScripts}.`
    : `You must call an script. The valid ones are: ${availableScripts}.`;
}

module.exports = {
  invalidScript
};
