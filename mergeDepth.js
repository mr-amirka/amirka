/**
 * @overview mergeDepth
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isArray = require('./isArray');
const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');
const isDefined = require('./isDefined');
const complement = require('./complement');

/**
 * Объединяет массив значений в одно значение до заданной глубины
 * @param mergingSrc {any} - значение или массив значений, которые нужно смерджить в один
 * @param dst {any} - объект, в который осуществляется мердж или значение по умолчанию
 * @param depth {number|undefined} - глубина мерджа для вложенных объектов
 * Возвращает смердженный объект
 *
 * @return {any}
 *
 * @example:
 * var obj1 = {name: 'Vasya'};
 * var obj2 = {age: 10, height: 170};
 * var dst = mergeDepth([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * mergeDepth([ obj1, obj2 ], dst);
 */
module.exports = (mergingSrc, dst, depth) => {
  depth || (depth = 0);
  if (depth < 0) return dst;
  if (!isObject(mergingSrc)) return isDefined(dst) ? dst : mergingSrc;;
  if (!isArray(mergingSrc)) return complement(dst, mergingSrc, depth);
  let last, tmp = isObject(dst) ? dst : undefined;
  for (let v, i = mergingSrc.length; i--;) {
    if (isPlainObject(v = mergingSrc[i])) {
      tmp = complement(tmp || {}, v, depth);
    } else {
      if (isDefined(v)) last = v;
    }
  }
  return tmp || last || dst;
};
