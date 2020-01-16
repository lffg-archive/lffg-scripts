const chalk = require('chalk');

/**
 * @param {Error} error
 * @return {string}
 */
function warnForError(error, color = 'gray') {
  return chalk`{yellow warn} {${color} ${error.stack || error}}`;
}

/**
 * @param {Error} error
 * @return {string}
 */
function errorForError(error, color = 'white') {
  return chalk`{red error} {${color} ${error.message || error}}`;
}

/**
 * @param {string} text
 * @return {string}
 */
function quoteAndUnderline(text) {
  return chalk`"{underline ${text}}"`;
}

module.exports = {
  warnForError,
  errorForError,
  quoteAndUnderline
};
