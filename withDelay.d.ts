/**
 * @overview withDelay
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */
import { fn } from "./global";

declare const withDelay: (fn: fn, delay?: number, result?: any) => fn;
export = withDelay;
