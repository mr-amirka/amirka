const attachEvent = require('../attachEvent');
const emitterProvider = require('../emitterProvider');
const w = window, d = w.document, de = d.documentElement; //eslint-disable-line
function getValue() {
  return [
    w.innerWidth || d.width || de.clientWidth,
    w.innerHeight || d.height || de.clientHeight,
  ];
};
module.exports = emitterProvider((emit) => {
  function trigger() {
    emit(getValue());
  }
  trigger();
  return attachEvent(w, 'resize', trigger);
}, getValue());
