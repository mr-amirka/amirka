/**
 * @overview redelay
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
/// <reference path="../global.d.ts"/>

declare const redelay: (fn: fn, _delay: number) => fn;
export = redelay;
