/**
 * @return {[string, string[]]}
 */
function parseArgv() {
  const [, , scriptName, ...args] = process.argv;
  return [scriptName, args];
}

module.exports = {
  parseArgv
};
