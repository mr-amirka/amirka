/**
 * @overview debounce
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import {fn} from "./global";

declare const debounce: (fn: fn, _delay: number) => fn;
export = debounce;
