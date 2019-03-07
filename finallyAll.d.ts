/**
 * @overview finallyAll
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const finallyAll: (fn: (inc: () => void, dec: () => void) => any, callback: fn) => any;
export = finallyAll;
