const delay = require('../delay');
const cancelablePromiseResolve = require('../CancelablePromise').resolve;

module.exports = (fn, _delay) => {
  let _cancel = delay(frame, _delay);
  let _promise = cancelablePromiseResolve();
  function next() {
    _cancel = delay(frame, _delay);
    _promise = cancelablePromiseResolve(fn());
  }
  function frame() {
    _promise.finally(next);
  }
  return () => {
    _cancel();
  };
};
