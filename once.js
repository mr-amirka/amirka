/**
 * @overview once
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (fn) => {
  let result;
  return function() {
    if (fn) {
      result = fn.apply(this, arguments); // eslint-disable-line
      fn = null;
    }
    return result;
  };
};
