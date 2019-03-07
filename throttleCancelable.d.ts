/**
 * @overview throttleCancelable
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const throttleCancelable: (fn: fn, _delay: number) => fn;
export = throttleCancelable;
