/**
 * @overview routeParseProvider
 * @example
 * var routeParse = routeParseProvider('/(users|friends):api.method/([^/]*):uid/(pictures)');
 * var params = {};
 * if (routeParse('/users/id6574334245/pictures', params)) {
 *   console.log(params); // => 
 *   {
 *      api: {
 *        method: 'users'
 *      },
 *      uid: 'id6574334245',
 *      0: 'pictures'
 *   }
 *   return true;
 * }
 * return false;
 *
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {regexpMapperProvider} from './regexp-mapper-provider';
export const routeParseProvider = (route: string, defaultValueExp?: string) => {
  const valueExp = defaultValueExp || '([^/]*)';
  const suffixExp = valueExp + ')';
  const keys = [ '$find' ], levels = [ keys ];
  let index = 0, depth = 0, lastDepth = 0;
  const prematcher = route.replace(regexp, (haystack, start, hasKey, key, end) => {
    if (start) {
      depth++;
      return '(';
    }
    depth--;
    let level = levels[depth] || (levels[depth] = []);
    level.push(end ? index++ : key);
    if (depth < lastDepth) {
      __push.apply(level, levels[lastDepth]);
      levels[lastDepth] = [];
    }
    lastDepth = depth;
    return hasKey || end ? ')' : suffixExp;
  });
  return regexpMapperProvider(new RegExp(prematcher), keys);
};
const regexp = /(\()|(\))?:([_A-Za-z0-9.]+)|(\))/g;
const __push = [].push;