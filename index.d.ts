/**
 * @overview minimalist utils
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


import * as noop from './noop';
//import * as loop from './loop';
//import * as loopMap from './loop-map';
//import * as range from './range';
import * as support from './support';
import * as aggregate from './aggregate';
import * as breakup from './breakup';
import { intval, floatval } from './any-val'
import * as size from './size';
import * as getByType from './get-by-type';
import * as set from './set';
import * as get from './get';
import * as complement from './complement';
//import * as destroyProvider from './destroy-provider';
import * as eachApply from './each-apply';
import * as eachTry from './each-try';
import * as cloneDepth from './clone-depth';
//import * as extendByPathsMap from './extend-by-paths-map';
import * as extendDepth from './extend-depth';
import * as flags from './flags';
import * as flagsSet from './flags-set';
import * as merge from './merge';
import * as mergeDepth from './merge-depth';
import * as extend from './extend';
import * as forIn from './for-in';
import * as forEach from './for-each';
import * as withoutEmpty from './without-empty';
import * as map from './map';
//import * as mapValues from './map-values';
import * as reduce from './reduce';
import * as once from './once';
import * as isEmpty from './is-empty';
import * as isCollection from './is-collection';
import * as isInsign from './is-insign';
import * as isString from './is-string';
import * as isPlainObject from './is-plain-object';
import * as isObject from './is-object';
import * as isArray from './is-array';
import * as isPromise from './is-promise';
import * as isIndex from './is-index';
import * as isLength from './is-length';
import * as delay from './delay';
import * as immediate from './immediate';
import * as removeOf from './remove-of';
import * as cssPropertiesStringifyProvider from './css-properties-stringify-provider';
import * as cssPropertiesParse from './css-properties-parse';
/*
import * as param from './param';
import * as unparam from './unparam';
import * as urlExtend from './url-extend';
import * as urlParse from './url-parse';
*/
import * as joinArrays from './join-arrays';
import * as joinMaps from './join-maps';
import * as escapedSplitProvider from './escaped-split-provider';
import * as mapperProvider from './mapper-provider';
import * as regexpMapperProvider from './regexp-mapper-provider';
import * as routeParseProvider from './route-parse-provider';
import * as unslash from './unslash';
import * as variance from './variance';
import * as single from './single';
import * as debounce from './debounce';
import * as throttle from './throttle';
import * as withReDelay from './with-re-delay';
import * as throttleCancelable from './throttle-cancelable';
import * as uniqLastApply from './uniq-last-apply';
import * as escapeQuote from './escape-quote';
import * as escapeRegExp from './escape-reg-exp';
import * as escapeCss from './escape-css';
import * as escapedBreakupProvider from './escaped-breakup-provider';
import * as upperFirst from './upper-first';
import * as lowerFirst from './lower-first';
import * as camelToKebabCase from './camel-to-kebab-case';
import * as kebabToCamelCase from './kebab-to-camel-case';
import * as splitProvider from './split-provider';
import * as joinProvider from './join-provider';
import * as pushArray from './push-array';
import * as push from './push';
import * as withDefer from './with-defer';
import * as withDelay from './with-delay';
import * as withResult from './with-result';
import * as trim from './trim';

export * from './global';

export {
  noop,
  loop,
  loopMap,
  range,
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
  destroyProvider,
  eachApply,
  eachTry,
  cloneDepth,
  extendByPathsMap,
  extendDepth,
  flags,
  flagsSet,
  merge,
  mergeDepth,
  extend,
  forIn,
  forEach,
  withoutEmpty,
  mapValues,
  map,
  reduce,
  once,
  isEmpty,
  isCollection,
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
