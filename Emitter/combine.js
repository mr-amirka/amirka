const map = require('../map');
const each = require('../each');
const isCollection = require('../isCollection');
const set = require('../set');
const get = require('../get');
const aggregateSubscriptions = require('../aggregateSubscriptions');
const Emitter = require('./index');
const {isEmitter} = Emitter;
const setBase = set.base;
const getBase = get.base;

const EMITTER_COMBINE_DEFAULT_DEPTH = 10;

function iterateeWarning(instance, key) {
  instance === undefined && console.warn('WARNING: ' + key + ' is undefined');
}

function combine(emitters) {
  if (!isCollection(emitters)) return new Emitter(emitters);
  let watchEmitters = [], emits = {}, _subscription, _value; // eslint-disable-line
  each(emitters, iterateeWarning);
  extract([], emitters, EMITTER_COMBINE_DEFAULT_DEPTH);
  function extract(path, src, depth) {
    return isEmitter(src) ? (
      setBase(emits, path, src.emit),
      watchEmitters.push([path, src]),
      src
    ) : (
      --depth < 1 || !isCollection(src)
        ? src
        : map(src, (v, k) => extract(path.concat([k]), v, depth))
    );
  }
  function onDestroy() {
    _subscription();
    _subscription = 0;
  }
  function getValue() {
    return combineGetValueBase(emitters, EMITTER_COMBINE_DEFAULT_DEPTH);
  }
  return new Emitter({
    emit: (v) => combineEmitBase(emits, v, EMITTER_COMBINE_DEFAULT_DEPTH),
    getValue: () => _subscription ? _value : getValue(),
    on: (watcher) => {
      let subscribed = 0;
      _subscription = aggregateSubscriptions(
          map(watchEmitters, function(args) {
            const path = args[0];
            return args[1].on((item) => {
              item === getBase(_value, path)
                || subscribed
                && watcher(setBase(_value = map(_value), path, item));
            });
          }),
      );
      _value = getValue();
      subscribed = 1;
      return onDestroy;
    },
  });
}
function combineGetValueBase(src, depth) {
  return isEmitter(src)
    ? src.getValue()
    : (
      depth-- < 1 || !isCollection(src)
        ? src
        : map(src, (v) => combineGetValueBase(v, depth))
    );
}
function combineEmitBase(emit, src, depth) {
  if (isFunction(emit)) return emit(src);
  if (depth < 1) return;
  depth--;
  let k, e; //eslint-disable-line
  for (k in src) (e = emit[k]) && combineEmitBase(e, src[k], depth); //eslint-disable-line
}

combine.some = (emitters, _value) => {
  const ons = map(emitters, 'on');
  return new Emitter({
    getValue: () => _value,
    on: (watcher) => aggregateSubscriptions(map(ons, (on) => on((v) => {
      watcher(_value = v);
    }))),
  });
};
module.exports = combine;
