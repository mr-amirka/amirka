/**
 * @overview sortBy
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iteratee-normalize');
const __sort = [].sort;

module.exports = (src, iteratee) => {
  const _iteratee = iterateeNormalize(iteratee);
  return __sort.call(src, (a, b) => _iteratee(a) - _iteratee(b));
};
