/**
 * @overview extendByPathsMap
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const extend = require("./extend");
const isPlainObject = require("./isPlainObject");
const get = require("./get");
const set = require("./set");
module.exports = (dst, src, map) => {
  if (!map) return dst;
  if (typeof map !== 'object') return get(src, map);
  let to, from, v;
  for (to in map) {
    from = map[to];
    if ((v = from === '' ? src : get(src, from)) === undefined) continue;
    to ? set(dst, to, v) : (isPlainObject(v) && extend(dst, v));
  }
  return dst;
};
