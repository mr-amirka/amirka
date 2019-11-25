/**
 * @overview CancelablePromiseProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import {
  cancel,
  defer,
  fn,
} from "./global";

interface IThenable <R> {
  then <U>(
      onFulfilled?: (value: R) => U | IThenable<U>,
      onRejected?: (error: any) => U | IThenable<U>,
  ): IThenable<U>;
}

type OnReject<U> = (error?: any) => U | IThenable<U>;
type OnResolve<T, U> = (subject?: T) => U | IThenable<U>;
type OnFinally<T> = (error?: any, subject?: T) => any;
type Executor<T> = <T>(resolve: (subject?: T | IThenable<T>) => void, reject: (error?: any) => void) => cancel | any;

   /**
    * @desctiption
    * Cancelable promise <br/>
    * This require consumer. <br/>
    * For execution must be called one of the methods: then, catch, finally, onCancel <br/>
    * Has link counter.
    * @example
    * ```js
    * // this require consumer
    * const cancelablePromise1 = new CancelablePromise((resolve) => {
    *   // here code never executed because no consumer
    *   // ...
    * });
    * const cancelablePromise2 = new CancelablePromise((resolve) => {
    *   // here code will be executed because method "then" is called
    *   // ...
    * }).then();
    * ```
    * @example
    * ```js
    * // with cancel
    * const cancelablePromise = new CancelablePromise((resolve) => {
    *   let timeoutId = setTimeout(() => {
    *     resolve(10);
    *   }, 1000);
    *   return () => {
    *     // executed if cancel
    *     if (timeoutId) {
    *       clearTimeout(timeoutId);
    *       timeoutId = null;
    *     }
    *   };
    * });
    * const childCancelablePromise = cancelablePromise
    *     .then((val) => {
    *       // never be executed
    *       console.log(val)
    *     })
    *     .onCancel(() => {
    *       // be executed if cancel
    *       console.log('canceled')
    *     });
    * childCancelablePromise.cancel();
    * ```
    * @example
    * ```js
    * // with custom deferApply
    * const defer = (callback) => {
    *   let timeoutId = setTimeout(callback, 0);
    *   return () => {
    *     // executed if cancel
    *     if (timeoutId) {
    *       clearTimeout(timeoutId);
    *       timeoutId = null;
    *     }
    *   };
    * };
    * const cancelablePromise = new CancelablePromise((resolve) => {
    *   //...
    *   return function onCancel() {
    *     //...
    *   }
    * }, defer);
    * ```
    * @example
    * ```js
    * //call 'then' with string as path
    * const cancelablePromise = CancelablePromise.resolve({
    *   persons: [
    *     {name: 'Vasya', age: 40, child: {name: 'Volodya', age: 20}},
    *     {name: 'Kate', age: 30, child: {name: 'Ann', age: 12}},
    *   ]
    * });
    * cancelablePromise
    *   .then('persons.1.child')
    *   .then((child) => console.log(child)); //=> {name: 'Ann', age: 12}
    * ```
    * @example
    * ```js
    * //cancelable request
    * function simpleRequest(method, url, body) {
    *   return new CancelablePromise((resolve, reject) => {
    *     const xhr = XMLHttpRequest();
    *     xhr.open(method, url, true);
    *     xhr.onload = () => {
    *       const status = xhr.status;
    *       if (status > 199 && status < 400) return resolve(xhr.response);
    *       reject(new Error('status ' + status));
    *     };
    *     xhr.onerror = reject;
    *     xhr.send(body);
    *     return () => {
    *       // be executed if cancel
    *       xhr.abort();
    *     };
    *   });
    * }
    * ```
    */
declare class CancelablePromise<T> implements IThenable<T> {
  public static resolve<U>(subject?: U | IThenable<U>): CancelablePromise<U>;
  public static reject<U>(subject?: any): CancelablePromise<U>;
  public static all(CancelablePromises: any[] | {[name: string]: any}):
      CancelablePromise<any[] | {[name: string]: any}>;
  public static race<U>(CancelablePromises: Array<U | IThenable<U>> | {[name: string]: U | IThenable<U>}):
      CancelablePromise<U>;
  public static defer<U>(callback?: (...args: any[]) => U, defer?: defer): CancelablePromise<U>;
  public static delay<U>(delay?: number, subject?: U, defer?: defer): CancelablePromise<U>;
  public static provide<U>(executor?: Executor<U>, defer?: defer): CancelablePromise<U>;
  public constructor(executor?: Executor<T>, defer?: defer);
  public then<U>(onResolve?: OnResolve<T, U> | string, onReject?: OnReject<U> | string, onCancel?: fn):
      CancelablePromise<U>;
  public catch<U>(onReject?: OnReject<U> | string, onCancel?: fn): CancelablePromise<U>;
  public finally(onFinally?: OnFinally<T>): CancelablePromise<T>;
  public onCancel(callback?: fn): CancelablePromise<T>;
  public cancel(): void;
  public resolve(subject?: T): cancel;
  public reject(subject?: any): cancel;
}
export = CancelablePromise;
