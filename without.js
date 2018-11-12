module.exports = (src, without) => {
  const dst = {};
  for (let key in src) without.indexOf(key) < 0 && (dst[key] = src[key]);
  return dst;
};
