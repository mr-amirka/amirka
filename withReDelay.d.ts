/**
 * @overview redelay
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { fn } from "./global";


declare const withReDelay: (fn: fn, _delay: number) => fn;
export = withReDelay;
