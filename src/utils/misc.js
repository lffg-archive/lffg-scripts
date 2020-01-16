/**
 * @param {() => any} block
 * @return {[Error |null] | [null, any]}
 */
function tryInline(block) {
  try {
    const data = block();
    return [null, data];
  } catch (error) {
    return [error, null];
  }
}

module.exports = {
  tryInline
};
