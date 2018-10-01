
const withoutEmpty = module.exports = (data, depth) => core(data, depth || 0);
const core = withoutEmpty.core = (src, depth) => {
  if (depth < 0) return src;
  depth--;
  const type = typeof(src);
  let dst = null, v, k, length;
  if (src === null || src === undefined || (type === 'string' && !src )) return null;
  if (type != 'object') return src;
  if (typeof(length = src.length) == 'number') {
    if (length < 1) return null;
    dst = [];
    for (k = 0; k < length; k++) ((v = core(src[k], depth)) === null) || dst.push(v);
    return dst.length ? dst : null;
  }
  for (k in src) ((v = core(src[k], depth)) === null) || ((dst || (dst = {}))[k] = v);
  return dst;
};