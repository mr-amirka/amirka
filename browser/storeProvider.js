const noop = require('../noop');
const isFunction = require('../isFunction');
const Emitter = require('../Emitter');

module.exports = (storage, prefix) => {
  storage || (storage = {});
  prefix || (prefix = '');
  const __on = storage.on || noop;
  const __get = storage.get || noop;
  const __set = storage.set || noop;
  return (name, init, value) => {
    name = prefix + name;
    if (!isFunction(init)) {
      value = init;
      init = noop;
    }
    function getInitialValue() {
      const v = __get(name);
      return v === undefined || v === null ? value : v;
    }
    function __emit(value) {
      __set(name, value);
    }
    const emitter = new Emitter((emit, getValue, on) => {
      emit(getInitialValue());
      init(__emit, getValue, on);
    }, getInitialValue());
    const emit = emitter.emit;
    __on((e) => {
      e.key === name && emit(value = e.value);
    });
    emitter.emit = __emit;
    return emitter;
  };
};
