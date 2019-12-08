const noop = require('../../noop');
const isFunction = require('../../isFunction');
const getter = require('../../get').getter;

module.exports = (mapOut, mapIn, value) => {
  mapOut = getter(mapOut);
  mapIn = getter(mapIn);
  return (self) => {
    const {emit, on, getValue} = self;
    let _value = value, cancelOut = noop, _watcher = noop, subscripion; // eslint-disable-line
    const getValueOut = mapOut ? (() => {
      _subscripion || asyncable(mapOut(getValue()), update);
      return _value;
    }) : getValue;
    const emitter = self.fork({
      emit: mapIn ? (isFunction(mapIn) ? (value) => {
        emitter._cancel();
        emitter._cancel = asyncable(value, (value) => {
          emit(mapIn(value, getValue));
        });
      } : emit) : noop,
      getValue: getValueOut,
      on: mapOut ? ((watcher) => {
        _value = getValueOut();
        _watcher = watcher;
        _subscripion = on((value) => {
          cancelOut();
          cancelOut = asyncable(mapOut(value), update);
        });
        return () => {
          if (_subscripion) {
            _watcher = noop;
            _subscripion();
            _subscripion = null;
          }
        };
      }) : on,
    }, _value);
    function update(value) {
      _watcher(_value = value);
    }
    return emitter;
  };
};
