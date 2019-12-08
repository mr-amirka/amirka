const noop = require('../noop');
const extend = require('../extend');
const reduce = require('../reduce');
const isObjectLike = require('../isObjectLike');
const isPromise = require('../isPromise');
const isFunction = require('../isFunction');
const addOf = require('../addOf');
const removeOf = require('../removeOf');
const forEach = require('../forEach');
const defer = require('../defer');
const cancelableThen = require('../cancelableThen');

module.exports = Emitter;

function initRootEmitter(self, _init, _value) {
  const _watchers = [];
  self._cancel = noop;
  self.on = on;
  self.emit = emit;
  self.getValue = getValue;

  if (!isFunction(_init)) {
    _value = _init;
    _init = noop;
  }
  if (isPromise(_value)) {
    const promise = _value;
    _value = undefined;
    emit(promise);
  }

  function __emit(value) {
    _value === value || forEach(_watchers, tryWithValue(_value = value));
  }
  function emit(value) {
    self._cancel();
    self._cancel = asyncable(value, __emit);
  }
  function getValue() {
    return _value;
  }
  function on(watcher) {
    _init && ((init) => {
      _init = null;
      const _watchers = [];
      init(
          emit,
          getValue,
          (watcher) => subscribeProvider(_watchers, watcher),
      );
      on((value) => {
        forEach(_watchers, tryWithValue(value));
      });
    })(_init);
    return subscribeProvider(_watchers, watcher);
  }
}

function Emitter(_init, _value) {
  const self = this;
  const on = _init && _init.on;
  const getValue = _init && _init.getValue;
  if (!(isFunction(on) && isFunction(getValue))) {
    return initRootEmitter(self, _init, _value);
  }
  extend(self, _init);
  const _watchers = [];
  let _subscription;
  function onEmit(value) {
    forEach(_watchers, tryWithValue(_value = value));
  }
  function onDestroy() {
    _subscription();
    _subscription = null;
  }
  self.getValue = () => _subscription ? _value : getValue();
  self.on = (watcher) => {
    const subscription = subscribe(_watchers, watcher, onDestroy);
    if (!_subscription) {
      _value = getValue();
      _subscription = on(onEmit);
    }
    return subscription;
  };
}

function subscribeProvider(watchers, watcher) {
  addOf(watchers, watcher);
  return function() {
    if (watcher) {
      removeOf(watchers, watcher);
      watcher = watchers = null;
    }
  };
}
function isEmitter(v) {
  return v && isFunction(v.on) && isFunction(v.getValue);
}
Emitter.isEmitter = isEmitter;
Emitter.prototype = {
  _cancel: noop,
  emit: noop,
  on: () => noop,
  getValue: noop,
  pipe() {
    return reduce(arguments, (emitter, pipe) => { // eslint-disable-line
      return pipe(emitter);
    }, this);
  },
  fork(extended, value) {
    return extend(new Emitter(this, value), extended);
  },

  /*
   Аналог setState в React, только для эмиттера и выполняет обновление состояния
    немедленно.
   Поверхностно объединяет переданное значение с внутренним значением состояния.
  */
  set(updatedState) {
    this.emit(isObjectLike(updatedState)
      ? extend(extend({}, this.getValue()), updatedState) : updatedState);
  },

  // операция сложения числа к текущему значению в эмиттере
  calc(self, v) {
    this.emit(this.getValue() + v);
  },
};

function asyncable(v, emit, hasAsync) {
  return isPromise(v)
    ? cancelableThen(v, emit)
    : (hasAsync ? defer(emit, [v]) : (emit(v), noop));
}
function subscribe(watchers, watcher, onDestroy) {
  addOf(watchers, watcher);
  return () => {
    if (watcher) {
      removeOf(watchers, watcher);
      watchers.length < 1 && onDestroy();
      onDestroy = watchers = watcher = null;
    }
  };
}
function tryWithValue(value) {
  return (watcher) => {
    try {
      watcher(value);
    } catch (ex) {
      console.error(ex);
    }
  };
}
