/**
 * @overview mergeDepth
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {isLength, isPlainObject} from 'lodash';
import {isOwner} from './is-owner';
import {complement} from './complement';

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
 * var dst = _.mergeDepth([ obj1, obj2 ]);
 *
 * или
 *
 * var dst = {};
 * _.mergeDepth([ obj1, obj2 ], dst);
 */
export const mergeDepth = (mergingSrc, dst, depth) => {
  depth || (depth = 0);
  if (depth < 0) return dst;
  if (!mergingSrc || typeof mergingSrc !== 'object') return dst === undefined ? mergingSrc : dst;
  let i = mergingSrc.length;
  if (!isLength(i)) return complement(dst, mergingSrc, depth);
  let tmp = isOwner(dst) ? dst : undefined;
  for (let v; i--;) {
    if ((v = mergingSrc[i]) === undefined) continue;
    if (isPlainObject(v)) {
      tmp = complement(tmp || {}, v, depth);
      continue;
    }
    if (!tmp) return tmp || v;
  }
  return tmp || dst;
};