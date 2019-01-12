const noop = require('../noop');
const delay = require('../delay');

module.exports = (fn, _delay) => {
  let _cancel = noop;
  function frame() {
    fn();
    _cancel = delay(frame, _delay);
  }
  frame();
  return () => {
    _cancel();
  };
};
