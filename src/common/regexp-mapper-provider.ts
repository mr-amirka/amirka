/**
 * @overview regexpMapperProvider
 * @example
 * const mapper = regexpMapperProvider(/^([^\]*)\/([^\]*)$/g, [ 'begin', 'end' ]);
 * var params = {};
 * if (mapper('users/id6574334245', params)) {
 *   console.log(params); // => 
 *   {
 *      begin: 'users',
 *      end: 'id6574334245'
 *   }
 *   return true;
 * }
 * return false;
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {mapperProvider} from './mapper-provider';

export const regexpMapperProvider = (regexp: RegExp, keys: string[]) => {
  const mapper = typeof keys === 'function' ? keys : mapperProvider(keys);
  return (text: string, dst?: any) => {
    const values = regexp.exec(text || '');
    if (!values) return false;
    if (dst) {
      mapper(values, dst);
      /*
      if ('index' in values) dst.$index = values.index;
      if ('input' in values) dst.$input = values.input;
      */
    }
    return true;
  };
};