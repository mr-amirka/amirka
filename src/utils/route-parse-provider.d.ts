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

import { regexpMapperProvider } from './regexp-mapper-provider';
declare const routeParseProvider: (route: string, defaultValueExp?: string) => regexpMapperProvider;
export = routeParseProvider;