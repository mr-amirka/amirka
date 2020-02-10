/**
 * @overview mapValues
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const mapValues: (input: {[name: string]: any}, iteratee: fn) => {[name: string]: any};
export = mapValues;
