/**
 * @overview destroyProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const forEach = require('./forEach');
const eachApply = require('./eachApply');
function destroyProvider(destroyers) {
  destroyers || (destroyers = []);
  function instance() {
    var _destroyers = destroyers;
    destroyers = null;
    _destroyers && eachApply(_destroyers);
    return instance;
  }
  var add = instance.add = function() {
    forEach(arguments, function(fn) {
      destroyers ? destroyers.push(fn) : fn();
    });
    return instance;
  };
  instance.child = function() {
    var child = destroyProvider();
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
