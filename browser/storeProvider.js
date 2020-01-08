const noop = require('../noop');
const isFunction = require('../isFunction');
const isDefined = require('../isDefined');
const Emitter = require('../Emitter');

module.exports = (storage, prefix) => {
  storage || (storage = {});
  prefix || (prefix = '');
  const __on = storage.on || noop;
  const __get = storage.get || noop;
  const __set = storage.set || noop;
  return (name, init, defaultValue) => {
    name = prefix + name;
    if (!isFunction(init)) {
      defaultValue = init;
      init = noop;
    }
    function getInitialValue() {
      return normalize(__get(name));
    }
    function __emit(v) {
      __set(name, defaultValue === v ? null : v);
    }
    function normalize(v) {
      return isDefined(v) ? v : defaultValue;
    }
    const emitter = new Emitter((emit, getValue, on) => {
      emit(getInitialValue());
      init(__emit, getValue, on);
    }, getInitialValue());
    const emit = emitter.emit;
    __on((e, v) => {
      e.key === name && emit(normalize(e.value));
    });
    emitter.emit = __emit;
    return emitter;
  };
};
