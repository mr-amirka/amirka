/**
 * @overview merge
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isPlainObject = require('./isPlainObject');
const isObject = require('./isObject');
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
  if (!(mergingSrc instanceof Array)) return extend(dst, mergingSrc);
  const length = mergingSrc.length;
  let tmp = isObject(dst) ? dst : undefined;
  for (let v, i = 0; i < length; i++) {
    if ((v = mergingSrc[i]) === undefined) continue;
    if (isPlainObject(v)) {
      tmp = extend(tmp || {}, v);
    } else {
      if (!tmp) return v;
    }
  }
  return tmp || dst;
};
