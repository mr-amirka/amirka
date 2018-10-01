/**
 * @overview immediate
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
/// <reference path="../global.d.ts"/>

declare const immediate: (fn: fn | null, args?: any[], ctx?: any) => fn;
export = immediate;
