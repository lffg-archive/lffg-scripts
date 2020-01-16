const chalk = require('chalk');

/**
 * @param {string} text
 * @return {string}
 */
function quoteAndUnderline(text) {
  return chalk`"{underline ${text}}"`;
}

module.exports = {
  quoteAndUnderline
};
