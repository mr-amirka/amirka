/**
 * @overview throttleCancelable
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const throttleCancelable: (fn: fn, _delay: number) => fn;
export = throttleCancelable;
