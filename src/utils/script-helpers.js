const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const debug = require('debug')('lffg-scripts:script-helpers');
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
function getPkgProp(fieldPath, defaultValue = undefined) {
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
function hasPkgProp(fieldPath, expectedFieldValue = Symbol.for('DEFAULT')) {
  const contents = getPkgProp(fieldPath);

  if (!contents) return false;
  if (expectedFieldValue === Symbol.for('DEFAULT')) return true;
  if (contents === expectedFieldValue) return true;
  return false;
}

// Adapted from https://github.com/kentcdodds/kcd-scripts
/**
 * @param {string} modName
 * @param {string | undefined} executable
 * @return {string}
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

/**
 * @param {string} command
 * @param {string[]} args
 * @return {import('child_process').SpawnSyncReturns<Buffer>}
 */
function spawnInRoot(command, args) {
  return spawn.sync(command, args, {
    cwd: CALLER_ROOT_PATH,
    stdio: 'inherit'
  });
}

/**
 * Calls `spawnInRoot` and resolves the given `moduleName` using `resolveBin`.
 *
 * @param {string} moduleName
 * @param {string[]} args
 * @param {{ moduleExecutable: string }} userOptions
 * @return {import('child_process').SpawnSyncReturns<Buffer>}
 */
function exec(moduleName, args, userOptions = {}) {
  const options = { moduleExecutable: moduleName, ...userOptions };
  return spawnInRoot(resolveBin(moduleName, options.moduleExecutable), args);
}

/**
 * Joins the given path with the caller directory's root unless an absolute path
 * is given. If an absolute path is given, it will be returned back with no
 * manipulations.
 *
 * @param {string[]} paths
 * @return {string}
 */
function resolvePath(...paths) {
  const pathName = path.join(...paths);

  if (path.isAbsolute(pathName)) {
    debug('Absolute path given to `resolvePath`.');
    return pathName;
  }

  return path.join(CALLER_ROOT_PATH, pathName);
}

/**
 * @param {string[]} paths
 * @return {boolean}
 */
function hasFile(...paths) {
  return fs.existsSync(resolvePath(...paths));
}

/**
 * Resolves a configuration file path from `src/config`.
 * Throws an error if the config does not exist.
 *
 * @param {string} configFileName
 * @return {string} - The config path.
 */
function resolveConfigPath(configFileName) {
  const configPath = path.join(__dirname, '../config', configFileName);

  if (!fs.existsSync(configPath)) {
    throw new Error(`The config "${configFileName}" does not exist.`);
  }

  return configPath;
}

module.exports = {
  CALLER_ROOT_PATH,
  callerRootPath,
  getPkgProp,
  hasPkgProp,
  resolveBin,
  spawnInRoot,
  exec,
  resolvePath,
  hasFile,
  resolveConfigPath
};
