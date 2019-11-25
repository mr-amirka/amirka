module.exports = function(dst) {
  __push.apply(dst, __slice.call(arguments, 1)); // eslint-disable-line
  return dst;
};
const __push = [].push;
const __slice = [].slice;
