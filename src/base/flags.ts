/**
 * @overview flags
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 * @example
 * flags([ 'apple', 'ban', 'test.use' ]); // => 
 * {
 *   apple: true,
 *   ban: true,
 *   test: {
 *     use: true
 *   }
 * }
 *
 */
import {set} from 'lodash';
export const flags = (flags: string[], dst?: any): flagsMap => {
  dst || (dst = {});
  for (let l = flags.length, i = 0; i < l; i++) set(dst, flags[i], true);
  return dst;
};
export const flagsSimple = (flags: string[], dst?: any): flagsMap => {
  dst || (dst = {});
  for (let l = flags.length, i = 0; i < l; i++) dst[ flags[i] ] = true;
  return dst;
};
