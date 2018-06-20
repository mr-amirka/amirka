
export const withoutEmpty = (data, depth) => core(data, depth || 0);
const core = (src, depth) => {
  if (depth < 0) return src;
  const type = typeof(src);
  let dst = null, v, k, length;
  if (src === null || src === undefined || (type === 'string' && !src )) return null;
  if (type != 'object')return src;
  if (typeof(src.length) == 'number') {
    if ((length = src.length) < 1) return null;
    dst = [];
    for (k = 0; k < length; k++) ((v = core(src[k])) === null) || dst.push(v);
    return dst.length ? dst : null;
  }
  for (k in src) ((v = core(src[k])) === null) || ((dst || (dst = {}))[k] = v);
  return dst;
};
