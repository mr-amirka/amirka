
import {removeOf} from '../base/remove-of';
import {immediate} from './immediate'

const COMPLETE = "complete";
const INTERACTIVE = "interactive";
const LISTENER_METHOD = "addEventListener";
const ATTACH_METHOD = "attachEvent";
const STATE_PROP = "readyState";
export const readyProvider = (w) => {
  const d = w.document;
  let readyList = [];
  let isReady = ((s) => s === COMPLETE || (!d[LISTENER_METHOD] && s === INTERACTIVE))(d[STATE_PROP]);
  const onReady = () => {
    if(isReady)return;
    isReady = true;
    for(let item, i = 0; i < readyList.length; i++){
      item = readyList[i];
      item.fn.apply(item.ctx, item.args);
    }
    readyList = [];
  };
  if(d[LISTENER_METHOD]) {
    d[LISTENER_METHOD]("DOMContentLoaded", onReady, false);
    w[LISTENER_METHOD]("load", onReady, false);
  }else {
    d[ATTACH_METHOD]("onreadystatechange", () => {
      d[STATE_PROP] === COMPLETE && onReady();
    });
    w[ATTACH_METHOD]("onload", ready);
  }
  return  (fn, args, ctx) => {
    if(isReady)return immediate(fn, args, ctx);
    let watcher = {fn, args: args || [], ctx: ctx || null};
    readyList.push(watcher);
    return () => {
      if(!watcher)return true;
      removeOf(readyList, watcher);
      watcher = null;
      return true;
    };
  };
};

