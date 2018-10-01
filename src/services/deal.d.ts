/**
 * @overview Deal
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

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
  	(onResolve: onSubject, onReject?: onSubject, onProgress?: onSubject): Deal;
  }
  export interface _catch {
  	(onReject: onSubject, onProgress?: onSubject): Deal;
  }
  export interface _finally {
  	(onFinally: onFinally, onProgress?: onSubject): Deal;
  }
  export interface _progress {
  	(onProgress: onSubject): Deal;
  }
}
declare class Deal {
  cancel: fn;
  then: Deal._then;
  catch: Deal._catch;
  finally: Deal._finally;
  progress: Deal._progress;
  resolve: (subject?: any) => fn;
  reject: (subject?: any) => fn;
  constructor(executor?: Deal.executor);
  static resolve: (subject?: any) => Deal;
  static reject: (subject?: any) => Deal;
  static all: (deals: any[]) => Deal;
  static race: (deals: any[]) => Deal;
  static delay: (_delay?: number) => Deal;
}
export = Deal;
