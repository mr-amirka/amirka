const delay = require('./delay');
const isFunction = require('./isFunction');
const noop = require('./noop');

module.exports = (fn, _delay) => {
  let hasDebounce, self, args, hasCalled, _cancelDelay = noop, _cancelApply = noop; // eslint-disable-line
  function execute() {
    cancelDelay = delay(exec, _delay);
    isFunction(_cancelApply = fn.apply(self, args))
      || (_cancelApply = noop);
  }
  function exec() {
    hasCalled ? (hasCalled = 0, execute()) : (hasDebounce = 0);
  }
  function cancel() {
    hasCalled = hasDebounce = 0;
  }
  return function() {
    self = this;
    args = arguments; // eslint-disable-line
    hasDebounce ? (hasCalled = 1) : (hasDebounce = 1, execute());
    return cancel;
  };
};
