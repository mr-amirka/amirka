/**
 * @overview push
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */
 
module.exports = function (dst) {
  __push.apply(dst, __slice.call(arguments, 1));
  return dst;
};
const __push = [].push;
const __slice = [].slice;
