const attachEvent = require('../attachEvent');
const Emitter = require('../Emitter');
const getViewportSize = require('../browser/getViewportSize');

module.exports = new Emitter((emit) => {
  function trigger() {
    emit(getViewportSize());
  }
  trigger();
  return attachEvent(window, 'resize', trigger);
}, getViewportSize());
