/**
 * @overview param
 * - конструктор GET парметров url
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isLength} from '../base/is-length';
import {withoutEmpty} from '../base/without-empty';

export const param = (v: any, excludePrefix?: string) => {
  if (!v || typeof v !== 'object') return '';
  const s: string[] = [];
  const prefixLength = (excludePrefix || (excludePrefix = '$')).length;
  const l = v.length;
  if (isLength(l)) {
    for (let i = 0; i < l; i++) {
      paramBuild(s, '' + i, v[i]);
    }
  } else {
    for (let k in v) {
      excludePrefix === k.slice(0, prefixLength) || paramBuild(s, k, v[k]);
    }
  }
  return s.join('&');
};
const paramBuild = (s: string[], p: string, v: any) => {
  s.push(paramEscape(p) + '=' + paramEscape(
    v && typeof v === 'object' ? JSON.stringify(withoutEmpty(v)) : ('' + v)
  ));
  return s;
};
export const paramEscape = (v: string) => {
  return encodeURIComponent(v)
    .replace(/%20/g, '+')
    .replace(/%22/g, '"')
    .replace(/%3A/g, ':')
    .replace(/%2C/g, ',');
};
