/**
 * @overview getByType
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
import {isArrayLikeObject} from 'lodash';

export const getByType = (args: any[], map: {[k: string]: string[] | string}, dst?: {[k: string]: any}) => {
  dst || (dst = {});
  let tmp = {}, i, v, k, keys, l = args.length;
  for (k in map) tmp[k] = (isArrayLikeObject(v = map[k]) ? [].concat(<any> v).reverse() : [ v ]);
  for (i = 0; i < l; i++) {
    (keys = tmp[ typeof(v = args[i]) ]) && keys.length && (dst[ keys.pop() ] = v);
  }
  return dst;
};