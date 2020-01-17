const debug = require('debug')('lffg-scripts:argv');
const { memoizeSame } = require('./misc');

/**
 * @typedef {{ scriptName: string, args: string[] }} Args
 * @type {() => Args}
 */
const parseArgv = memoizeSame(function parseArgv() {
  const [, , scriptName, ...args] = process.argv;
  debug('Raw args: %j', args);
  return { scriptName, args };
});

/**
 * @param {string} arg
 * @return {boolean}
 */
function hasArg(arg) {
  const { args } = parseArgv();
  const exists = args.includes(arg);
  debug(`Arg "${arg}" exists? Returned ${exists}`);
  return exists;
}

/**
 * Will return the arg if it's included in the process argv. If an array is
 * given, only the first included arg will be returned.
 * If `customArg` is given, it will be returned when a given arg is found.
 *
 * @param {string | string[]}
 * @return {string}
 */
function forwardArg(args, customArg = undefined) {
  if (!Array.isArray(args)) {
    args = [args];
  }

  for (const arg of args) {
    if (hasArg(arg)) {
      const toForward = customArg || arg;
      debug(`Forwarded "${toForward}" by "${arg}".`);
      return toForward;
    }
  }

  return '';
}

module.exports = {
  parseArgv,
  hasArg,
  forwardArg
};
