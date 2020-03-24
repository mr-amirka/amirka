const forEach = require('./forEach');
const removeOf = require('./removeOf');
const eachApply = require('./eachApply');

function destroyProvider(destroyers) {
  destroyers || (destroyers = []);
  function instance() {
    const _destroyers = destroyers;
    destroyers = 0;
    _destroyers && eachApply(_destroyers);
    return instance;
  }
  function add() {
    forEach(arguments, function(fn) { // eslint-disable-line
      destroyers ? destroyers.push(fn) : fn();
    });
    return instance;
  }
  instance.add = add;
  instance.remove = function(fn) {
    removeOf(destroyers, fn);
    return instance;
  };
  instance.child = function() {
    const child = destroyProvider();
    add(child);
    return child;
  };
  instance.isDestroyed = function() {
    return !destroyers;
  };
  instance.clear = function() {
    if (destroyers) destroyers = [];
    return instance;
  };
  return instance;
}
module.exports = destroyProvider;
