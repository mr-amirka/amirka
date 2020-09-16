module.exports = (args, map, dst) => {
  dst = dst || {};
  let tmp = {}, i = 0, v, k, keys, l = args.length; // eslint-disable-line
  for (k in map) tmp[k] = map[k].slice().reverse(); // eslint-disable-line
  for (; i < l; i++) (keys = tmp[typeof(v = args[i])]) // eslint-disable-line
    && keys.length && (dst[keys.pop()] = v);
  return dst;
};
