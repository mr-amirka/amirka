/**
 * @overview isMatch
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (src, matchs, depth) => !isNotMatch(src, matchs, depth || 10);
function isNotMatch(src, matchs, depth) {
  if (src === matchs) return;
  if (depth < 0) return;
  const t1 = typeof src, t2 = typeof matchs;
  if (t1 !== t2 || t1 !== 'object' || !src) return true;
  depth--;
  for (let k in matchs) {
    if (isNotMatch(src[k], matchs[k], depth)) return true;
  }
}
