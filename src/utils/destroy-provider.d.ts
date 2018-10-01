/**
 * @overview destroyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
 /// <reference path="../global.d.ts"/>
 
declare namespace destroyProvider {
  export interface destroyProvider {
  	(..._destroyers: any[]): destroy;
  }
  export interface destroy {
  	(...args: any[]): destroy;
  	add: (fn?: fn) => destroy;
  }
}

declare const destroyProvider: destroyProvider.destroyProvider;
export = destroyProvider;
