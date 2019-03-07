/**
 * @overview withDefer
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
import { fn } from "./global";

declare const withDefer: (fn: fn, result?: any) => fn;
export = withDefer;
