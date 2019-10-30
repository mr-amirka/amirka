/**
 * @overview forEach
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (src, fn) => src && base.call(src, fn);
const base = [].forEach || (Array.prototype.forEach = function(fn) {
  for (var l = this.length || 0, i = 0; i < l; i++) fn(this[i], i);
});
