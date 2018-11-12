const isPromise = require('mn-utils/is-promise');
const isFunction = require('mn-utils/is-function');

module.exports = (fn) => {
  const base = (value) => {
    isFunction(value) ? value(base) : (isPromise(value) ? value.then(base) : fn(value));
  };
  return base;
};
