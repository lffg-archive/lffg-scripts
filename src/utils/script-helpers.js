const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const debug = require('debug')('lffg:script-helpers');
const { path: ramdaPath } = require('ramda');
const readPkgUp = require('read-pkg-up');
const which = require('which');
const { tryInline } = require('./misc');
const { apply } = require('./paths');

const CALLER_CWD = process.cwd();

const pkgInfo = readPkgUp.sync({
  cwd: fs.realpathSync(CALLER_CWD)
});

const CALLER_ROOT_PATH = path.dirname(pkgInfo.path);
const callerRootPath = apply(CALLER_ROOT_PATH);

const callerPkg = pkgInfo.packageJson;

/**
 * @param {string | string[]} fieldPath
 * @param {any} defaultValue
 * @return {any}
 */
function getFromPkg(fieldPath, defaultValue = undefined) {
  const contents = ramdaPath(
    Array.isArray(fieldPath) ? fieldPath : fieldPath.split('.'),
    callerPkg
  );

  return typeof contents === 'undefined' ? defaultValue : contents;
}

/**
 * @param {string | string[]} fieldPath
 * @param {any} expectedFieldValue
 * @return {boolean}
 */
function hasInPkg(fieldPath, expectedFieldValue = Symbol.for('DEFAULT')) {
  const contents = getFromPkg(fieldPath);

  if (!contents) return false;
  if (expectedFieldValue === Symbol.for('DEFAULT')) return true;
  if (contents === expectedFieldValue) return true;
  return false;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @return {any}
 */
function spawnInRoot(command, ...args) {
  return spawn.sync(command, args, { stdio: 'inherit' });
}

// Adapted from https://github.com/kentcdodds/kcd-scripts
/**
 * @param {string} modName
 * @param {string | undefined} executable
 */
function resolveBin(modName, executable = modName) {
  debug(`Resolving bin for module ${modName}, executable ${executable}`);

  const [, pathFromWhich] = tryInline(() =>
    fs.realpathSync(which.sync(modName))
  );

  debug(`"pathFromWhich" is ${pathFromWhich}`);
  if (pathFromWhich && pathFromWhich.includes('.CMD')) {
    debug(`"pathFromWhich" includes ".cmd". Returning ${pathFromWhich}`);
    return pathFromWhich;
  }

  try {
    const modPkgPath = require.resolve(modName);
    const modDirPath = path.dirname(modPkgPath);
    debug(`"modulePkgPath" is ${modPkgPath}`);

    const { bin } = require(modPkgPath);
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    debug(`"binPath" is ${modPkgPath}`);

    const fullPathToBin = path.join(modDirPath, binPath);
    debug(`"fullPathToBin" is ${modPkgPath}`);

    if (fullPathToBin === pathFromWhich) {
      debug(`"fullPathToBin === pathFromWhich". Returning ${executable}`);
      return executable;
    }

    const resolvedPath = fullPathToBin.replace(CALLER_CWD, '.');
    debug(`Returning "resolvedPath" as ${resolvedPath}`);
    return resolvedPath;
  } catch (error) {
    if (pathFromWhich) {
      debug(`Returning "pathFromWhich" from catch block as ${executable}`);
      return executable;
    }

    debug('Will throw error. No binary was resolved.');

    throw new Error(
      `The "${executable}" binary does not exist. You may have forgotten to install the "${modName}" package.`
    );
  }
}

module.exports = {
  CALLER_ROOT_PATH,
  callerRootPath,
  getFromPkg,
  hasInPkg,
  spawnInRoot,
  resolveBin
};
