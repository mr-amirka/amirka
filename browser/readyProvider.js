/**
 * @overview readyProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const defer = require('../defer');
const attachEvent = require('../attachEvent');
const isDocumentStateReady = require('./isDocumentStateReady');

module.exports = (w) => {
  var d = w.document, first = {}, last = first;
  var hasReady = isDocumentStateReady(w);
  attachEvent(d, "readystatechange", onChange, false);
  attachEvent(d, "DOMContentLoaded", onReady, false);
  attachEvent(w, "load", onReady, false);
  return function(fn, args, ctx) {
    if (hasReady) return defer(fn, args, ctx);
    var watcher = [ fn, args, ctx ];
    var node = last = last.next = {
      watcher: watcher
    };
    return function() {
      if (watcher) node.watcher = watcher = null;
      return true;
    };
  };
  function onReady() {
    if (hasReady) return;
    hasReady = true;
    for (var item = first, watcher; item = item.next;) {
      (watcher = item.watcher) && watcher[0].apply(watcher[2] || null, watcher[1] || []);
    }
    first = {};
  }
  function onChange() {
    isDocumentStateReady(w) && onReady();
  }
};
