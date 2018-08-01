
import {immediate} from '../base/immediate'

interface watcher {
  fn: fn;
  args?: any[];
  ctx?: any
}
interface node {
  watcher?: watcher | null,
  next?: node
}

const LISTENER_METHOD = "addEventListener";
const ATTACH_METHOD = "attachEvent";
const isReady = (s: string) => /complete|interactive/.test(s);
export const readyProvider = (w: Window) => {
  const d = w.document;
  let first: node = {};
  let last = first;
  let hasReady = isReady(d.readyState);
  const onReady = () => {
    if (hasReady) return;
    hasReady = true;
    for (let item: node = first, watcher: watcher; item = <node> item.next;) {
      if (watcher = <watcher> item.watcher) watcher.fn.apply(watcher.ctx, watcher.args);
    }
    first = {};
  };
  if (d[LISTENER_METHOD]) {
    d[LISTENER_METHOD]("DOMContentLoaded", onReady, false);
    w[LISTENER_METHOD]("load", onReady, false);
  } else {
    d[ATTACH_METHOD]("onreadystatechange", () => isReady(d.readyState) && onReady());
    w[ATTACH_METHOD]("onload", onReady);
  }
  return  (fn: fn, args?: any[], ctx?: any) => {
    if (hasReady) return immediate(fn, args, ctx);
    let watcher: watcher | null = {fn, args: args || [], ctx: ctx || null};
    let node: node = last.next = { watcher };
    last = node;
    return () => {
      if (watcher) node.watcher = watcher = null;
      return true;
    };
  };
};

