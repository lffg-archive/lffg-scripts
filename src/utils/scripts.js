const fs = require('fs');
const { memoizeWith, pipe, map, filter, tryCatch, always } = require('ramda');
const { scriptsPath, SCRIPTS_PATH } = require('./paths');

/**
 * @typedef {{ name: string, path: string, run: (scriptArgs: string[]) => void}} ScriptObject
 */

/**
 * @type {() => ScriptObject[]}
 */
const getScripts = memoizeWith(always(1), () => {
  const tryRequire = tryCatch((path) => require(path).run, always(null));

  const createScriptObject = pipe(
    (name) => ({ name, path: scriptsPath(name, 'index.js') }),
    (data) => ({ ...data, run: tryRequire(data.path) })
  );

  const createScriptObjectAndRemoveInvalid = pipe(
    map(createScriptObject),
    filter((dir) => typeof dir.run === 'function')
  );

  return createScriptObjectAndRemoveInvalid(fs.readdirSync(SCRIPTS_PATH));
});

/**
 * @param {string} scriptName
 * @return {ScriptObject}
 */
function getScriptByName(scriptName) {
  return getScripts().find(({ name }) => name === scriptName);
}

/**
 * @return {string[]}
 */
function getScriptNames() {
  return getScripts().map(({ name }) => name);
}

/**
 * @param {string} scriptName
 * @return {boolean}
 */
function isValidScript(scriptName) {
  return getScriptNames().includes(scriptName);
}

module.exports = {
  getScripts,
  getScriptByName,
  getScriptNames,
  isValidScript
};
