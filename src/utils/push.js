const __push = [].push;
const __slice = [].slice;
module.exports = function (dst) {
  __push.apply(dst, __slice.call(arguments, 1));
  return dst;
};
