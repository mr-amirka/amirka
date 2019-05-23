/**
 * @overview unparam
 * - парсит GET-параметры URL
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isObject = require('./isObject');
const breakup = require('./breakup');
const unparam = module.exports = s => {
  const type = typeof s;
  return type === 'string' ? base(s) : (type === 'object' ? s : {});
};
const decode = s => {
  try { return JSON.parse(s); } catch(e) {}
  return s;
};
const expSpace = /\+/g;
const expBrackets = /\[(.*?)\]/g;
const expVarname = /(.+?)\[/;
const base = unparam.base = s => {
  const a = decodeURIComponent(breakup(s, '?', true)[1]).split('&');
  const l = a.length;
  const r = {};
  if (l < 1) return r;
  for (let w, t, k, v, b, c, d, j, n, ni, q, i = 0; i < l; i++) {
    if ((w = a[i]).length < 1) continue;
    if ((k = (w = breakup(w, '='))[0]).length < 1) continue;
    v = decode(w[1].replace(expSpace, ' '));
    b = [];
    while (w = expBrackets.exec(k)) b.push(w[1]);
    if ((c = b.length) < 1) {
      r[k] = v;
      continue;
    }
    c--;
    w = expVarname.exec(k);
    if (!w || !(k = w[1]) || w.length < 1) continue;
    if (!isObject(d = r[k])) d = r[k] = {};
    for (j = 0, q = b.length; j < q; j++) {
      if ((w = b[j]).length < 1) {
        w = 0;
        for (n in d) {
          if (!isNaN(ni = parseInt(n)) && ni >= 0 && (ni % 1 === 0) && ni >= w) w = ni + 1;
        }
      }
      if (j == c) {
        d[w] = v;
      } else {
        d = isObject(t = d[w]) ? t : (d[w] = {});
      }
    }
  }
  return r;
};
