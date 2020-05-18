const noop = require('../noop');
const isFunction = require('../isFunction');
const isDefined = require('../isDefined');
const isPromise = require('../isPromise');
const isEqual = require('../isEqual');
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
      __set(name, isEqual(defaultValue, v) ? null : v);
    }
    function emitAsync(v) {
      isPromise(v) ? v.then(__emit) : __emit(v);
    }
    function normalize(v) {
      return isDefined(v) ? v : defaultValue;
    }
    const emitter = new Emitter((emit, getValue, on) => {
      emit(getInitialValue());
      init(emitAsync, getValue, on);
    }, getInitialValue());
    const emit = emitter.emit;
    __on((e, v) => {
      e.key === name && emit(normalize(e.value));
    });
    emitter.emit = emitAsync;
    return emitter;
  };
};
