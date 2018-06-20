/**
 * @overview param
 * - конструктор GET парметров url
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {withoutEmpty} from '../base/without-empty';

export const param = (v, excludePrefix) => {
  if (!v || typeof v !== 'object') return '';
  const s = [];
  const prefixLength = (excludePrefix || (excludePrefix = '$')).length;
  const l = v.length;
  if (typeof l === 'number') {
    for (let i = 0; i < l; i++) {
      paramBuild(s, i, v[i]);
    }
  } else {
    for (let k in v) {
      excludePrefix === k.slice(0, prefixLength) || paramBuild(s, k, v[k]);
    }
  }
  return s.join('&').replace(exp20, '+').replace(exp22, '"').replace(exp3A, ':').replace(exp2C, ',');
};
const exp20 = /%20/g, exp22 = /%22/g, exp3A = /%3A/g, exp2C = /%2C/g;
const buildMap = {
  object(v) {
    const dst = withoutEmpty(v);
    return dst ? JSON.stringify(dst) : dst;
  },
  string: v => v
};
const paramBuild = (s, p, v) => {
  const build = buildMap[typeof v];
  if (build) s.push(encodeURIComponent(p) + '=' + encodeURIComponent(build(v)));
  return s;
};
