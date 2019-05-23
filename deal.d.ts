/**
 * @overview Deal
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

import { fn } from 'mn-utils';

declare namespace Deal {
  export interface onSubject {
  	(subject?: any): any;
  }
  export interface onFinally {
  	(error?: any, subject?: any): any;
  }
  export interface executor {
  	(resolve: onSubject, reject: onSubject, progress: onSubject): fn | void;
  }
  export interface _then {
  	(onResolve: onSubject, onReject?: onSubject, onProgress?: onSubject, onCancel?: onSubject): Deal;
  }
  export interface _catch {
  	(onReject: onSubject, onCancel?: onSubject): Deal;
  }
  export interface _finally {
  	(onFinally: onFinally, onProgress?: onSubject): Deal;
  }
  export interface _watchProgress {
  	(onProgress: onSubject): Deal;
  }
  export interface _watchCancel {
  	(onProgress: onSubject): Deal;
  }
  export interface addIntoTurn {
  	(callback: fn): fn;
  }
}
declare class Deal {
  cancel: fn;
  then: Deal._then;
  catch: Deal._catch;
  finally: Deal._finally;
  watchProgress: Deal._watchProgress;
  watchCancel: Deal._watchCancel;
  resolve: (subject?: any) => fn;
  reject: (subject?: any) => fn;
  constructor(executor?: Deal.executor, turnSetter?: Deal.addIntoTurn);
  static resolve: (subject?: any) => Deal;
  static reject: (subject?: any) => Deal;
  static all: (deals: any[]) => Deal;
  static race: (deals: any[]) => Deal;
  static delay: (_delay?: number) => Deal;
}
export = Deal;
