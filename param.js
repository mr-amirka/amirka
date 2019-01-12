/**
 * @overview param
 * - конструктор GET парметров url
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
const withoutEmpty = require('./without-empty');
const param = module.exports = (v, excludePrefix) => {

  if (!v || typeof v !== 'object') return '';
  const s = [];
  const prefixLength = (excludePrefix || (excludePrefix = '$')).length;
  const l = v.length;
  if (isLength(l)) {
    for (let i = 0; i < l; i++) paramBuild(s, '' + i, v[i]);
  } else {
    for (let k in v) excludePrefix === k.slice(0, prefixLength) || paramBuild(s, k, v[k]);
  }
  return s.sort().join('&');
};
const paramBuild = (s, p, v) => {
  v = withoutEmpty(v);
  v === null || s.push(paramEscape(p) + '=' + paramEscape(
    typeof v === 'object' ? JSON.stringify(v) : ('' + v)
  ));
  return s;
};
const paramEscape = param.escape = v => encodeURIComponent(v)
  .replace(/%20/g, '+')
  .replace(/%22/g, '"')
  .replace(/%3A/g, ':')
  .replace(/%2C/g, ',');