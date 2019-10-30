/**
 * @overview param
 * - конструктор GET парметров url
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const withoutEmpty = require('./withoutEmpty');
const PARAM_WITHOUT_EMPTY_DEFAULT_DEPTH = 10;
const param = module.exports = (v) => {
  if (!v || typeof v !== 'object') return '';
  const s = [];
  function paramBuild(p, v) {
    v = withoutEmpty(v, PARAM_WITHOUT_EMPTY_DEFAULT_DEPTH);
    v === null || s.push(paramEscape(p) + '=' + paramEscape(
      typeof v === 'object' ? JSON.stringify(v) : ('' + v)
    ));
    return s;
  }
  if (v && (v instanceof Array)) {
    const l = v.length;
    for (let i = 0; i < l; i++) paramBuild('' + i, v[i]);
  } else {
    for (let k in v) paramBuild(k, v[k]);
  }
  return s.sort().join('&');
};
const paramEscape = param.escape = v => encodeURIComponent(v)
  .replace(/%20/g, '+')
  .replace(/%22/g, '"')
  .replace(/%3A/g, ':')
  .replace(/%2C/g, ',');
