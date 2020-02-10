/**
 * @overview attachEvent
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const noop = require('./noop');
module.exports = function(node, eventName, callback, options) {
  if (node.addEventListener) {
    node.addEventListener(eventName, callback, options || (options = false));
    return function() {
      if (node) {
        node.removeEventListener(eventName, callback, options);
        node = eventName = callback = options = null;
      }
    };
  }
  if (node.attachEvent) {
    node.attachEvent(eventName = 'on' + eventName, callback);
    return function() {
      if (node) {
        node.detachEvent(eventName, callback);
        node = eventName = callback = options = null;
      }
    };
  }
  return noop;
};
