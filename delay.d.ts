/**
 * @overview delay
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const delay: (fn: fn | null, _delay?: number, args?: any, ctx?: any) => fn;
export = delay;
