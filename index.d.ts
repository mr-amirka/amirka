/**
 * @overview minimalist utils
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */


import * as noop from './noop';
//import * as loop from './loop';
//import * as loopMap from './loopMap';
//import * as range from './range';
import * as support from './support';
import * as aggregate from './aggregate';
import * as breakup from './breakup';
import { intval, floatval } from './anyval'
import * as size from './size';
import * as getByType from './getByType';
import * as set from './set';
import * as get from './get';
import * as complement from './complement';
//import * as destroyProvider from './destroy-provider';
import * as eachApply from './eachApply';
import * as eachTry from './eachTry';
import * as cloneDepth from './cloneDepth';
//import * as extendByPathsMap from './extend-by-paths-map';
import * as extendDepth from './extendDepth';
import * as flags from './flags';
import * as flagsSet from './flagsSet';
import * as merge from './merge';
import * as mergeDepth from './mergeDepth';
import * as extend from './extend';
import * as forIn from './forIn';
import * as forEach from './forEach';
import * as withoutEmpty from './withoutEmpty';
import * as map from './map';
//import * as mapValues from './map-values';
import * as reduce from './reduce';
import * as once from './once';
import * as isEmpty from './isEmpty';
//import * as isCollection from './isCollection';
import * as isInsign from './isInsign';
import * as isString from './isString';
import * as isPlainObject from './isPlainObject';
import * as isObject from './isObject';
import * as isArray from './isArray';
import * as isPromise from './isPromise';
import * as isIndex from './isIndex';
import * as isLength from './isLength';
import * as delay from './delay';
import * as immediate from './immediate';
import * as removeOf from './removeOf';
import * as cssPropertiesStringifyProvider from './cssPropertiesStringifyProvider';
import * as cssPropertiesParse from './cssPropertiesParse';
/*
import * as param from './param';
import * as unparam from './unparam';
import * as urlExtend from './url-extend';
import * as urlParse from './url-parse';
*/
import * as joinArrays from './joinArrays';
import * as joinMaps from './joinMaps';
import * as escapedSplitProvider from './escapedSplitProvider';
import * as mapperProvider from './mapperProvider';
import * as regexpMapperProvider from './regexpMapperProvider';
import * as routeParseProvider from './routeParseProvider';
import * as unslash from './unslash';
import * as variance from './variance';
import * as single from './single';
import * as debounce from './debounce';
import * as throttle from './throttle';
import * as withReDelay from './withReDelay';
import * as throttleCancelable from './throttleCancelable';
import * as uniqLastApply from './uniqLastApply';
import * as escapeQuote from './escapeQuote';
import * as escapeRegExp from './escapeRegExp';
import * as escapeCss from './escapeCss';
import * as escapedBreakupProvider from './escapedBreakupProvider';
import * as upperFirst from './upperFirst';
import * as lowerFirst from './lowerFirst';
import * as camelToKebabCase from './camelToKebabCase';
import * as kebabToCamelCase from './kebabToCamelCase';
import * as splitProvider from './splitProvider';
import * as joinProvider from './joinProvider';
import * as pushArray from './pushArray';
import * as push from './push';
import * as withDefer from './withDefer';
import * as withDelay from './withDelay';
import * as withResult from './withResult';
import * as trim from './trim';

export * from './global';

export {
  noop,
  //loop,
  //loopMap,
  //range,
  support,
  aggregate,
  breakup,
  intval,
  floatval,
  size,
  getByType,
  set,
  get,
  complement,
  //destroyProvider,
  eachApply,
  eachTry,
  cloneDepth,
  //extendByPathsMap,
  extendDepth,
  flags,
  flagsSet,
  merge,
  mergeDepth,
  extend,
  forIn,
  forEach,
  withoutEmpty,
  //mapValues,
  map,
  reduce,
  once,
  isEmpty,
  //isCollection,
  isInsign,
  isString,
  isPlainObject,
  isObject,
  isArray,
  isPromise,
  isIndex,
  isLength,
  delay,
  immediate,
  removeOf,
  cssPropertiesStringifyProvider,
  cssPropertiesParse,
  /*
  param,
  unparam,
  urlExtend,
  urlParse,
  */
  joinArrays,
  joinMaps,
  escapedSplitProvider,
  mapperProvider,
  regexpMapperProvider,
  routeParseProvider,
  unslash,
  variance,
  single,
  debounce,
  throttle,
  withReDelay,
  throttleCancelable,
  uniqLastApply,
  escapeQuote,
  escapeRegExp,
  escapeCss,
  escapedBreakupProvider,
  upperFirst,
  lowerFirst,
  camelToKebabCase,
  kebabToCamelCase,
  splitProvider,
  joinProvider,
  pushArray,
  push,
  withDefer,
  withDelay,
  withResult
};
