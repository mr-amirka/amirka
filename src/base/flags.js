/**
 * @overview flags
 * @example
 * flags([ 'apple', 'ban', 'test.use' ]); // => 
 * {
 *   apple: true,
 *   ban: true,
 *   test: {
 *     use: true
 *   }
 * }
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
import {set} from 'lodash';
export const flags = (flags, dst) => {
  dst || (dst = {});
  for (let l = flags.length, i = 0; i < l; i++) set(dst, flags[i], true);
  return dst;
};
export const flagsSimple = flags.simple = (flags, dst) => {
  dst || (dst = {});
  for (let l = flags.length, i = 0; i < l; i++) dst[ flags[i] ] = true;
  return dst;
};
