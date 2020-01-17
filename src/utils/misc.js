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

/**
 * Note: This memoize function WILL always return the same value—returned from
 * the first call to the `fn` param. The `args` are NOT forwarded from the
 * returned function to the given `fn` param.
 *
 * @param {() => any} fn
 * @return {() => any}
 */
function memoizeSame(fn) {
  let store = Symbol.for('DEFAULT');

  return () => {
    if (store === Symbol.for('DEFAULT')) {
      store = fn();
    }

    return store;
  };
}

module.exports = {
  tryInline,
  memoizeSame
};
