const noop = require('../noop');
const extend = require('../extend');
const isLength = require('../isLength');
const isPromise = require('../isPromise');
const isObjectLike = require('../isObjectLike');
const isFunction = require('../isFunction');

const merge = require('../merge');
const forIn = require('../forIn');
const get = require('../get');
const set = require('../set');
const withReDelay = require('../withReDelay');
const defer = require('../defer');

const {getter} = get;
const getBase = get.base;
const setBase = set.base;

const emitterProvider = module.exports = (init, value) => {
  let _watcher = noop, _subscripion = noop, _cancel = noop; //eslint-disable-line
  const watchers = new Set();

  if (!isFunction(init)) {
    value = init;
    init = noop;
  }

  const onDestroy = () => {
    _subscripion();
    _subscripion = _watcher = noop;
  };
  const __emit = (_value) => {
    watchers.forEach(tryWithValue(value = _value));
    _watcher(_value);
  };
  const emit = (_value) => {
    _cancel();
    _cancel = asyncable(_value, __emit);
  };

  if (isPromise(value)) {
    const promise = value;
    value = undefined;
    promise.then(__emit);
  }

  const getValue = () => value;
  const on = (watcher) => subscribeProvider(watchers, watcher);
  return fork({
    emit,
    getValue,
    on: (watcher) => {
      _watcher = watcher;
      _subscripion = init(emit, getValue, on) || noop;
      init = noop;
      return onDestroy;
    },
  });
};


const subscribeProvider = (watchers, watcher) => {
  watchers.add(watcher);
  return () => {
    if (watcher) {
      watchers.delete(watcher);
      watcher = watchers = 0;
    }
  };
};

const isEmitter = emitterProvider.isEmitter = (v) => {
  return v && isFunction(v.on) && isFunction(v.emit) && isFunction(v.getValue);
};

const Emitter = emitterProvider.Emitter = function() {};

Emitter.prototype = {
  _cancel: noop,
  emit: noop,
  on: () => noop,
  getValue: noop,
  map(mapOutOrigin, mapIn, value) {
    const mapOut = getter(mapOutOrigin);
    mapIn = getter(mapIn);

    const self = this;
    const {emit, on, getValue} = self;
    let inited, _watcher = noop; //eslint-disable-line
    function __emit(v) {
      _watcher(value = v);
    }
    function __pipe(v) {
      emitter._cancel();
      emitter._cancel = asyncable(mapOut(v), __emit);
    }
    const emitter = fork(self, {
      emit: mapIn ? (isFunction(mapIn) ? (v) => {
        self._cancel();
        self._cancel = asyncable(mapIn(v, getValue), emit);
      } : emit) : noop,
      getValue: mapOutOrigin ? (() => {
        __pipe(getValue());
        return value;
      }) : getValue,
      on: mapOutOrigin ? ((watcher) => {
        _watcher = watcher;
        return on(__pipe);
      }) : on,
    });
    return emitter;
  },

  // получить дочерний эмиттер для конкретного поля объекта
  prop(key) {
    const path = key.split('.');
    let cache;
    return this.map((v) => {
      return (cache = v) && getBase(v, path);
    }, (propValue) => {
      const v = extend({}, cache);
      setBase(v, path, propValue);
      return v;
    });
  },

  // асинхронно эмитить значение в эмиттер
  async(v) {
    const self = this;
    self._cancel();
    self._cancel = asyncable(v, self.emit, true);
  },

  // получить дочерний эмиттер c фильтрацией значений
  filter(check) {
    check = getter(check);
    const self = this;
    const on = self.on;
    return fork(self, {
      on: (watcher) => on((value) => {
        check(value) && watcher(value);
      }),
    });
  },

  // соединенить эмиттер с другим эмиттером по определенному принципу
  connect(mapOut, mapIn, emitter) {
    const self = this;
    mapOut = getter(mapOut);
    mapIn = getter(mapIn);

    const initial = emitter;
    isEmitter(emitter) || (emitter = emitterProvider(initial));

    let locked;
    const emitIn = self.emit;
    const emitOut = emitter.emit;

    if (initial === undefined) {
      emitter._cancel = asyncable(mapOut(self.getValue()), emitOut);
    }

    emitter.on((v) => {
      if (locked) return;
      self._cancel();
      self._cancel = asyncable(mapIn(v), emitIn);
    });
    self.on((v) => {
      locked = true;
      emitter._cancel();
      emitter._cancel = asyncable(mapOut(v), emitOut);
      locked = false;
    });
    return emitter;
  },

  /*
   Аналог setState в React, только для эмиттера и выполняет обновление состояния немедленно.
   Поверхностно объединяет переданное значение с внутренним значением состояния.
  */

  set(updatedState) {
    const self = this;
    self.emit(isObjectLike(updatedState) ? extend(extend({}, self.getValue()), updatedState) : updatedState);
  },

  // операция сложения числа к текущему значению в эмиттере
  calc(v) {
    const self = this;
    self.emit(self.getValue() + v);
  },

  /*
    Получить дочерний эмиттер, который будет эмититься с задержкой "wait" от родительского эмиттера.
    Можно указать занчение по умочланию "_value".
  */
  delay(wait, _value) {
    const self = this;
    const __on = self.on;
    if (_value === undefined) _value = self.getValue();
    return fork(self, {
      on: watcher => {
        return __on(withReDelay((value) => {
          watcher(_value = value);
        }, wait));
      },
      getValue: () => _value,
    });
  },

  /*
    Добавление экземпляру эмиттера методов.
    @example:
    const emitter = emitterProvider(false);

    // добавление методов
    emitter.behave({
      enable: () => true,
      disable: () => false,
      toggle: state => !state
    });

    // использование методов
    emitter.enable();
    emitter.disable();
    emitter.toggle(); // переключение тумблера


    @example:
    const emitter = emitterProvider(0);
    // добавление методов
    emitter.behave({
      select: (state, id) => id,
      clear: () => 0,
      toggle: (state, id) => state === id ? 0 : id
    });

    // использование методов
    emitter.select(10); // выбрали пункт меню с id 10
    emitter.clear(); // очистка
    emitter.toggle(10); // если этот элемент был выбран, то очистка, если элемент не был выбран, то он выбирается.


    @example:
    const emitter = emitterProvider(false);
    const enableBehavior = {
      enable: () => true,
      disable: () => false
    };
    const toggleBehavior = {
      toggle: state => !state
    };

    // добавление методов
    emitter.behave([ enableBehavior, toggleBehavior ]);

    // использование методов
    emitter.enable();
    emitter.disable();
    emitter.toggle();
  */
  behave(methods) {
    const self = this;
    const __getValue = self.getValue;
    forIn(isLength(methods.length) ? merge(methods, {}, true) : methods, (method, methodName) => {
      self[methodName] = value => {
        self.emit(method(__getValue(), value));
      };
    });
    return self;
  }
};


const asyncable = (v, emit, isAsync) => {
  const _emit = (v) => {
    emit && emit(v);
  };
  const _cancel = () => {
    v = emit = null;
  };
  return (isPromise(v) ? v.then(_emit).cancel : (isAsync ? defer(emit, [ v ]) : emit(v))) || _cancel;
};

const pipeExtend = (dst, src) => {
  let v, k;
  for (k in src) (v = src[k]) && (dst[k] = v);
  return dst;
};

const fork = emitterProvider.fork = (prototype, extended) => {
  const src = pipeExtend(pipeExtend({}, prototype),  extended);
  const { on, getValue } = src;
  const watchers = new Set();
  let _value, _subscription;
  const onEmit = (value) => {
    _value === value || watchers.forEach(tryWithValue(_value = value));
  };
  const onDestroy = () => {
    _subscription();
    _subscription = null;
  };

  src.getValue = () => _subscription ? _value : getValue();
  src.on = watcher => {
    const subscription = subscribe(watchers, watcher, onDestroy);
    if (!_subscription) {
      _value = getValue();
      _subscription = on(onEmit);
    }
    return subscription;
  };

  return extend(new Emitter(), src);
};

const subscribe = (watchers, watcher, onDestroy) => {
  watchers.add(watcher);
  return () => {
    if (watcher) {
      watchers.delete(watcher);
      watchers.size < 1 && onDestroy();
      onDestroy = watchers = watcher = 0;
    }
  };
};

const tryWithValue = (value) => {
  return (watcher) => {
    try {
      watcher(value);
    } catch(ex) {
      console.error(ex);
    }
  };
};
