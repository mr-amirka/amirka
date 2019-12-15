const isPromise = require('./isPromise');
const isFunction = require('./isFunction');

module.exports = (fn) => {
  let _cancel;
  function instance() {
    cancel();
    return _cancel = fn.apply(this, arguments); // eslint-disable-line
  }
  function cancel() {
    return isFunction(_cancel)
      ? _cancel()
      : isPromise(_cancel) && isFunction(_cancel.cancel) && _cancel.cancel();
  }
  instance.cancel = cancel;
  return instance;
};
