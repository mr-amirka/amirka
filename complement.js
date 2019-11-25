/**
 * @overview complement
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * @description
 * Расширяет целевой объект полями другого объекта до указанной глубины, но не заменяет поля,
 * которые уже заполнены скалярными значениями
 *
 * Более эффективный способ глубокого объединения объектов, ибо так производится меньше копирований,
 * чем при обычном глубоком копировании
 * @example
 * complement({
 *    name: "Vasya"
 * }, {
 *    name: "Volodya",
 *    age: 30
 * }) // => {name: "Vasya", age: 30}
 *
 */

const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');
const complement = module.exports = (dst, src, depth) => {
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return dst === undefined ? src : dst;
  if (!isObject(dst)) {
    if (dst !== undefined) return dst;
    dst = {};
  }
  return __complement(dst, src, depth);
};
const __complement = complement.base = (dst, src, depth) => {
  depth--;
  let k, to, from, dp = depth > -1;
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if ((to = dst[k]) === undefined) {
      dp && isPlainObject(from)
        ? __complement(dst[k] = {}, from, depth)
        : (dst[k] = from);
      continue;
    }
    dp && isObject(to) && isPlainObject(from) && __complement(to, from, depth);
  }
  return dst;
};
