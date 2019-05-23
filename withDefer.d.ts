/**
 * @overview withDefer
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */
import { fn } from "./global";

declare const withDefer: (fn: fn, result?: any) => fn;
export = withDefer;
