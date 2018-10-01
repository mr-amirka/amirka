
const immediate = require('../utils/immediate');
const LISTENER_METHOD = "addEventListener";
const ATTACH_METHOD = "attachEvent";
const isReady = s => /complete|interactive/.test(s);
module.exports = (w) => {
  const d = w.document;
  let first = {};
  let last = first;
  let hasReady = isReady(d.readyState);
  const onReady = () => {
    if (hasReady) return;
    hasReady = true;
    for (let item = first, watcher; item = item.next;) {
      (watcher = item.watcher) && watcher.fn.apply(watcher.ctx, watcher.args);
    }
    first = {};
  };
  const change = () => isReady(d.readyState) && onReady();
  if (d[LISTENER_METHOD]) {
    d[LISTENER_METHOD]("readystatechange", change, false);
    d[LISTENER_METHOD]("DOMContentLoaded", onReady, false);
    w[LISTENER_METHOD]("load", onReady, false);
  } else {
    d[ATTACH_METHOD]("onreadystatechange", change);
    w[ATTACH_METHOD]("onload", onReady);
  }
  return (fn, args, ctx) => {
    if (hasReady) return immediate(fn, args, ctx);
    let watcher = {fn, args: args || [], ctx: ctx || null};
    let node = last.next = { watcher };
    last = node;
    return () => {
      if (watcher) node.watcher = watcher = null;
      return true;
    };
  };
};
