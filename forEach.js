const __forEach = [].forEach;

module.exports = __forEach ? ((src, fn) => {
  src && __forEach.call(src, fn);
}) : ((src, fn) => {
  for (let l = src && src.length || 0, i = 0; i < l; i++) fn(src[i], i);
});
