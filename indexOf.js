/**
 * @overview indexOf
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const __indexOf = [].indexOf || function(el) {
  for (let l = this.length || 0, i = 0; i < l; i++) {
    if (this[i] === el) return i;
  }
  return -1;
};
module.exports = (collection, v) => __indexOf.call(collection, v);
