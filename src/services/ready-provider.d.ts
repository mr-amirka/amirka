/// <reference path="../global.d.ts"/>

declare namespace readyProvider {
  export interface watcher {
    fn: fn;
    args?: any[];
    ctx?: any
  }
  export interface node {
    watcher?: watcher | null,
    next?: node
  }
  export interface ready {
    (fn: fn, args?: any[], ctx?: any): (() => void);
  }
}
declare const readyProvider: (w: Window) => readyProvider.ready;
export = readyProvider;
