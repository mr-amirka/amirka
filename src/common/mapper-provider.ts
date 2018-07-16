/**
 * @overview mapperProvider
 * @example
 * const mapper = mapperProvider([ 'name', 'age']);
 * mapper([ 'Вася', 30 ]) //=> {name: 'Вася', age: 30}
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {set} from 'lodash';
export const mapperProvider = (keys: string[]) => {
  keys || (keys = []);
  const l = keys.length;
  return (values: string[], dst?: any) => {
    dst || (dst = {}); 
    if (!values) return dst;
    for (let i = 0; i < l; i++) {
      set(dst, keys[i], values[i] || '');
    }
    return dst;
  };
};
