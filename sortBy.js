/**
 * @overview sortBy
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const iterateeNormalize = require('./iterateeNormalize');
const __sort = [].sort;

module.exports = (src, iteratee) => {
  const _iteratee = iterateeNormalize(iteratee);
  return __sort.call(src, (a, b) => _iteratee(a) - _iteratee(b));
};
