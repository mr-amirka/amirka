const noop = require('../noop');
const delay = require('../delay');

module.exports = (fn, _delay) => {
  let _cancel = noop;
  function frame() {
    _cancel = delay(frame, _delay);
    fn();
  }
  frame();
  return () => {
    _cancel();
  };
};
