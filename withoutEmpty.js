const isArray = require('./isArray');
const withoutEmpty = module.exports = (data, depth) => base(data, depth || 0);
const base = withoutEmpty.base = (src, depth) => {
  if (depth < 0) return src;
  depth--;
  const type = typeof(src);
  let dst = null, v, k;
  if (src === null || src === undefined || (type === 'string' && !src )) return null;
  if (type != 'object') return src;
  if (isArray(src)) return src.length ? src : null;
  for (k in src) ((v = base(src[k], depth)) === null) || ((dst || (dst = {}))[k] = v);
  return dst;
};
