/**
 * @overview param
 * - конструктор GET парметров url
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isLength} from 'lodash';
import {withoutEmpty} from '../base/without-empty';

export const param = (v, excludePrefix) => {
  if (!v || typeof v !== 'object') return '';
  const s = [];
  const prefixLength = (excludePrefix || (excludePrefix = '$')).length;
  const l = v.length;
  if (isLength(l)) {
    for (let i = 0; i < l; i++) {
      paramBuild(s, i, v[i]);
    }
  } else {
    for (let k in v) {
      excludePrefix === k.slice(0, prefixLength) || paramBuild(s, k, v[k]);
    }
  }
  return s.join('&');
};
const buildMap = {
  object(v) {
    const dst = withoutEmpty(v);
    return dst ? JSON.stringify(dst) : dst;
  },
  string: v => v
};
const paramBuild = (s, p, v) => {
  const build = buildMap[typeof v];
  if (build) s.push(paramEscape(p) + '=' + paramEscape(build(v)));
  return s;
};
const paramEscape = v => {
  return encodeURIComponent(v)
    .replace(/%20/g, '+')
    .replace(/%22/g, '"')
    .replace(/%3A/g, ':')
    .replace(/%2C/g, ',');
};
