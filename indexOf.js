/**
 * @overview indexOf
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const __indexOf = [].indexOf || (Array.prototype.indexOf = function(el) {
  for (var l = this.length || 0, i = 0; i < l; i++) {
    if (this[i] === el) return i;
  }
  return -1;
});
module.exports = (collection, v) => __indexOf.call(collection, v);
