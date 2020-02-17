module.exports = (fn, result, ctx) => {
  return function() {
    fn.apply(ctx || this, arguments); // eslint-disable-line
    return result;
  };
};
