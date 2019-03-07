

module.exports = (fn, result) => {
  return function(){
    fn.apply(this, arguments);
    return result;
  };
};
