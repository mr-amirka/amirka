/**
 * @overview withStateProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example
const withState = withStateProvider({
  Component: Component
});

const AnyComponent = withState((setState, self) => {
  return (state, props) => {
    return (
      <div>{state.limit}</div>
    );
  };
}, {
  limit: 10
});
*/

const childClass = require('../childClass');
const combine = require('../Emitter/combine');
const eachTry = require('../eachTry');
const forEach = require('../forEach');
const noop = require('../noop');

module.exports = (env) => {
  const {Component} = env;
  return (constructor, emitters) => {
    const emitter = combine(emitters || {});
    const {getValue} = emitter;
    return childClass(Component, function() {
      const self = this;
      function onMount(cb) {
        _mountWatchers.push(cb);
      }
      function useEffect(cb, values) {
        _effects.push([cb, values]);
      }
      function mountIteratee(cb) {
        _mountSubscriptions.push(cb() || noop);
      }
      function checkEffects() {
        const effects = _effects;
        _effects = [];
        forEach(effects, (item, index, i, l, prev, cb, next, subscription) => {
          subscription = _effectSubscriptions[index] || noop;
          cb = item[0];
          next = item[1];
          (prev = _prevEffects[index]) && (prev = prev[1]);
          if (prev && next && (l = next.length) == prev.length) {
            for (i = 0; i < l; i++) {
              if (prev[i] !== next[i]) {
                subscription();
                return _effectSubscriptions[index] = cb() || noop;
              }
            }
          } else {
            subscription();
            _effectSubscriptions[index] = cb() || noop;
          }
        });
        _prevEffects = effects;
      }
      self.state = getValue();
      self.render = () => {
        return render.apply(self, [
          self.state,
          self.props,
          useEffect,
        ]);
      };
      self.componentDidUpdate = checkEffects;
      self.UNSAFE_componentWillMount = () => {
        _subscription || (
          _subscription = emitter.on(setState),
          setState(getValue()),
          forEach(_mountWatchers, mountIteratee)
        );
      };
      self.componentWillUnmount = (w) => {
        _subscription && (
          _subscription(),
          _subscription = 0,
          _mountWatchers = [],
          w = _mountSubscriptions,
          _mountSubscriptions = [],
          eachTry(w),
          w = _effectSubscriptions,
          _effectSubscriptions = [],
          eachTry(w),
          _effects = [],
          _prevEffects = []
        );
      };
      let _subscription;
      let _mountWatchers = [];
      let _mountSubscriptions = [];
      let _effectSubscriptions = [];
      let _effects = [];
      let _prevEffects = [];
      const setState = self.setState.bind(self);
      const render = constructor(setState, self, onMount);
    });
  };
};
