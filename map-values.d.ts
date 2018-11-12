/**
 * @overview mapValues
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const mapValues: (input: {[name: string]: any}, iteratee: fn) => {[name: string]: any};
export = mapValues;
