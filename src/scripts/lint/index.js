const debug = require('debug')('lffg-scripts:lint');
const { forwardArg } = require('../../utils/argv');
const {
  hasFile,
  hasPkgProp,
  exec,
  resolveConfigPath
} = require('../../utils/script-helpers');

/**
 *
 */
function run() {
  const useBuiltInConfig =
    !hasFile('.eslintrc') &&
    !hasFile('.eslintrc.js') &&
    !hasFile('.eslintrc.json') &&
    !hasPkgProp('eslintConfig');

  debug(`Built in config will be used? ${useBuiltInConfig}`);
  const config = useBuiltInConfig
    ? ['--config', resolveConfigPath('.eslintrc.json')]
    : [];

  const args = [
    forwardArg('--fix'),
    ...config,
    '--max-warnings',
    '0',
    '.'
  ].filter(Boolean);

  debug('Args: %o', args);

  const { status } = exec('eslint', args);
  process.exit(status);
}

module.exports = {
  run
};
