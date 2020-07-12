const __slice = [].slice;

module.exports = function(self) {
  return __slice.apply(self, __slice.call(arguments, 1)); // eslint-disable-line
};
