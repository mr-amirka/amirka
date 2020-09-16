module.exports = (fn) => {
  let result;
  return function() {
    fn && (result = fn.apply(this, arguments), fn = 0); // eslint-disable-line
    return result;
  };
};
