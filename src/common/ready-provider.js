
import {removeOf} from '../base/remove-of';
import {immediate} from './immediate'

const LISTENER_METHOD = "addEventListener";
const ATTACH_METHOD = "attachEvent";
const isReady = s => /complete|interactive/.test(s);
export const readyProvider = (w) => {
  const d = w.document;
  let readyList = [];
  let hasReady = isReady(d.readyState);
  const onReady = () => {
    if (hasReady) return;
    hasReady = true;
    for (let item, i = 0; i < readyList.length; i++) {
      item = readyList[i];
      item.fn.apply(item.ctx, item.args);
    }
    readyList = [];
  };
  if (d[LISTENER_METHOD]) {
    d[LISTENER_METHOD]("DOMContentLoaded", onReady, false);
    w[LISTENER_METHOD]("load", onReady, false);
  } else {
    d[ATTACH_METHOD]("onreadystatechange", () => isReady(d.readyState) && onReady());
    w[ATTACH_METHOD]("onload", ready);
  }
  return  (fn, args, ctx) => {
    if (hasReady) return immediate(fn, args, ctx);
    let watcher = {fn, args: args || [], ctx: ctx || null};
    readyList.push(watcher);
    return () => {
      if (watcher) {
        removeOf(readyList, watcher);
        watcher = null;
      }
      return true;
    };
  };
};

