/**
 * @return {boolean}
 */
function isProd() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Will throw an error if `NODE_ENV` is "production". The error will be
 * returned otherwise.
 *
 * @param {Error} error
 * @return {Error | never}
 */
function throwIfProd(error) {
  if (isProd()) {
    throw error;
  }

  return error;
}

/**
 * Will throw an error if `NODE_ENV` is "development". The error will be
 * returned otherwise.
 */
function throwIfDev(error) {
  if (!isProd()) {
    throw error;
  }

  return error;
}

module.exports = {
  isProd,
  throwIfProd,
  throwIfDev
};
