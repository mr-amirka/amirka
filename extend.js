
module.exports = (dst, src) => {
  let k;
  for (k in src) dst[k] = src[k]; // eslint-disable-line
  return dst;
};
