/**
 * @overview flagsSet
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 * flagsSet([ 'apple', 'ban', 'test.use' ]); // =>
 * {
 *   apple: true,
 *   ban: true,
 *   test: {
 *     use: true
 *   }
 * }
 *
 */

import { FlagsMap } from "./global";

declare const flagsSet: (flags: string[], dst?: any) => FlagsMap;
export = flagsSet;
