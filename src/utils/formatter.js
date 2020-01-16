/**
 * @param {string[]} list
 * @param {(string) => string | undefined} mapFn
 * @return {string}
 */
function joinList(list, mapFn = undefined) {
  const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'disjunction'
  });

  return formatter.format(mapFn ? list.map(mapFn) : list);
}

module.exports = {
  joinList
};
