/**
 * @overview CancelablePromiseProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import CancelablePromise = require("./CancelablePromise");
import {defer} from "./global";

/**
 * @desctiption
 * Cancelable promise provider <br/>
 *
 * @example
 * ```js
 * // width default options
 * const CancelablePromise = CancelablePromiseProvider();
 * const cancelablePromise = new CancelablePromise((resolve) => {
 *   resolve('Hello!');
 * });
 * ```
 * @example
 * ```js
 * // width custom options
 * const CancelablePromise = CancelablePromiseProvider(defer, Promise);
 * const cancelablePromise = new CancelablePromise((resolve) => {
 *   resolve('Hello!');
 * });
 * ```
 */
declare function CancelablePromiseProvider(defaultDefer?: defer, parentClass?: any): CancelablePromise<any>;
export = CancelablePromiseProvider;
