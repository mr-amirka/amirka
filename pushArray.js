/**
 * @overview pushArray
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (dst, src) => {
  __push.apply(dst, src);
  return dst;
};
const __push = [].push;
