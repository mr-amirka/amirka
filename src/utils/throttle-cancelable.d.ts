/**
 * @overview throttleCancelable
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
 /// <reference path="../global.d.ts"/>

declare const throttleCancelable: (fn: fn, _delay: number) => fn;
export = throttleCancelable;
