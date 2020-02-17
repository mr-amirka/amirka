module.exports = (fn) => {
  let locked;
  return function() {
    if (locked) return;
    locked = 1;
    const result = fn.apply(this, arguments); // eslint-disable-line
    locked = 0;
    return result;
  };
};
