const __forEach = [].forEach;

module.exports = __forEach
  ? ((src, fn) => {
    src && __forEach.call(src, fn);
  })
  : ((src, fn) => {
    let l = src.length || 0, i = 0; // eslint-disable-line
    for (; i < l; i++) fn(src[i], i);
  });
