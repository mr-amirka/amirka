/**
 * @overview polyfill
 * Подгружает полифилы, если нет оригинальной реализации
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 *
 * polyfill({
 *   'CSS.escape': 'assets/standalone-shims/css.escape.shim.js',
 *   'Promise': 'assets/standalone-shims/promise.shim.js'
 * }, window);
 *
 */


import * as Deal from './deal';

declare namespace polyfill {
    export interface polyfill {
        (map: {[name: string]: any}, _global?: any): Deal;
        andReady: (map: {[name: string]: any}, _global?: any) => Deal;
    }
}
declare const polyfill: polyfill.polyfill;
export = polyfill;
