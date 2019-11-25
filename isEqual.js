/**
 * @overview isEqual
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (src1, src2, depth) => !isNotEqual(src1, src2, depth || 0);
const isNotEqual = (src1, src2, depth) => {
  if (src1 === src2) return;
  if (depth < 0) return true;
  const t1 = typeof src1, t2 = typeof src2;
  if (t1 !== t2 || t1 !== 'object' || !src1 || !src2) return true;
  depth--;
  let k, cache = {};
  for (k in src1) {
    if (isNotEqual(src1[k], src2[k], depth)) return true;
    cache[k] = true;
  }
  for (k in src2) {
    if (!cache[k] && isNotEqual(src1[k], src2[k], depth)) return true;
  }
};
