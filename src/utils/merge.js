/**
 * @overview merge
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
const isPlainObject = require('./is-plain-object');
const isObject = require('./is-object');
const extend = require('./extend');

/**
 * Объединяет массив значений в одно значение
 * @param mergingSrc {any} - значение или массив значений, которые нужно смерджить в один
 * @param dst {any} - объект, в который осуществляется мердж или значение по умолчанию
 * Возвращает смердженный объект
 *
 * @return {any}
 *
 * @example:
 * var obj1 = {name: 'Vasya'};
 * var obj2 = {age: 10, height: 170};
 * var dst = merge([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * merge([ obj1, obj2 ], dst);
 */
module.exports = (mergingSrc, dst) => {
  if (!isObject(mergingSrc)) return dst === undefined ? mergingSrc : dst;
  let i = mergingSrc.length;
  if (!isLength(i)) return extend(dst, mergingSrc);
  let tmp = isObject(dst) ? dst : undefined;
  for (let v; i--;) {
    if ((v = mergingSrc[i]) === undefined) continue;
    if (isPlainObject(v)) {
      tmp = extend(tmp || {}, v);
    } else {
      if (!tmp) return v;
    }
  }
  return tmp || dst;
};
