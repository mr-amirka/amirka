/**
 * @overview globalNameProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
 /// <reference path="../global.d.ts"/>

declare const globalNameProvider: (scope?: any, prefix?: string) => ((fn: fn, ctx?: any) => string);
export = globalNameProvider;
