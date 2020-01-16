const path = require('path');

/**
 * @param {string[]} paths
 * @return {(...paths: string[]) => string}
 */
function apply(...paths) {
  return path.join.bind(undefined, ...paths);
}

const scriptsPath = apply(__dirname, '..', 'scripts');
const SCRIPTS_PATH = scriptsPath();

module.exports = {
  apply,
  scriptsPath,
  SCRIPTS_PATH
};
