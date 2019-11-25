const map = require('../map');
const each = require('../each');
const isObjectLike = require('../isObjectLike');
const isObject = require('../isObject');
const set = require('../set');
const get = require('../get');
const aggregateSubscriptions = require('../aggregateSubscriptions');
const emitterProvider = require('./pipe');
const {fork, isEmitter} = emitterProvider;
const setBase = set.base;
const getBase = get.base;

const EMITTER_COMBINE_DEFAULT_DEPTH = 10;

const combine = module.exports = (emitters) => {
  if (!isObject(emitters)) return emitterProvider(emitters);
  each(emitters, (instance, key) => {
    instance === undefined && console.warn('WARNING: ' + key + ' is undefined');
  });
  const watchEmitters = [];
  const emits = {};
  function extract(path, src, depth) {
    if (isEmitter(src)) {
      setBase(emits, path, src.emit);
      watchEmitters.push([path, src]);
      return src;
    }
    depth--;
    if (depth < 1 || !isObjectLike(src)) return src;
    return map(src, (v, k) => extract(path.concat([k]), v, depth));
  }
  const bone = extract([], emitters, EMITTER_COMBINE_DEFAULT_DEPTH);
  const getValue
    = () => combineGetValueBase(bone, EMITTER_COMBINE_DEFAULT_DEPTH);
  let _subscription, _value; //eslint-disable-line
  function onDestroy() {
    _subscription();
    _subscription = null;
  }
  return fork({
    emit: (v) => combineEmitBase(emits, v, EMITTER_COMBINE_DEFAULT_DEPTH),
    getValue: () => _subscription ? _value : getValue(),
    on: (watcher) => {
      _value = getValue();
      _subscription = aggregateSubscriptions(
          map(watchEmitters, function([path, emitter]) {
            return emitter.on((item) => {
              if (item === getBase(_value, path)) return;
              setBase(_value = map(_value), path, item);
              watcher(_value);
            });
          }),
      );
      return onDestroy;
    },
  });
};

function combineGetValueBase(src, depth) {
  if (isEmitter(src)) return src.getValue();
  depth--;
  if (depth < 1 || !isObject(src)) return src;
  return map(src, (v, k) => combineGetValueBase(v, depth));
}
function combineEmitBase(emit, src, depth) {
  if (isFunction(emit)) {
    emit(src);
    return;
  }
  if (depth < 1) return;
  depth--;
  var k, e; //eslint-disable-line
  for (k in src) (e = emit[k]) && combineEmitBase(e, src[k], depth); //eslint-disable-line
}

combine.some = (emitters, _value) => {
  const ons = map(emitters, 'on');
  return fork({
    getValue: () => _value,
    on: (watcher) => aggregateSubscriptions(map(ons, (on) => on((v) => {
      watcher(_value = v);
    }))),
  });
};
