
const noop = require('../noop');
const isFunction = require('../isFunction');
const aggregateSubscriptions = require('../aggregateSubscriptions');

const emitterProvider = require('../emitterProvider');
const isEmitter = emitterProvider.isEmitter;

module.exports = (storage, prefix) => {
  storage || (storage = {});
  prefix || (prefix = '');
  const __on = storage.on || noop;
  const __get = storage.get || noop;
  const __set = storage.set || noop;
  return (name, init, value) => {
    if (!isFunction(init)) {
      value = init;
      init = noop;
    }
    const getInitialValue = () => {
      const v = __get(name);
      return v === undefined || v === null ? value : v;
    };
    name = prefix + name;
    const emitter = emitterProvider((emit, getValue, on) => {
      emit(getInitialValue());
      init(emit, getValue, on);
    }, getInitialValue());
    const emit = emitter.emit;
    __on((event) => {
      event.key === name && emit(value = event.value);
    })
    emitter.emit = (value) => {
      __set(name, value);
    };
    return emitter;
  };
};
