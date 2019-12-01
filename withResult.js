module.exports = (fn, result) => {
  return function() {
    fn.apply(this, arguments); // eslint-disable-line
    return result;
  };
};
