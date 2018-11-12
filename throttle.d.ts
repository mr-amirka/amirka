/**
 * @overview throttle
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const throttle: (fn: fn, _delay: number) => fn;
export = throttle;
