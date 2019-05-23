/**
 * @overview aggregate
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import { fn, eachApply }  from "./global";

declare const aggregate: (funcs: fn[], aggregator: eachApply) => fn;
export = aggregate;
