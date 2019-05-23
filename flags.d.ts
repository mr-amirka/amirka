/**
 * @overview flagsSet
 * @author Amir Absolutely <mr.amirka@ya.ru>
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

declare const flags: (flags: string[], dst?: any) => FlagsMap;
export = flags;
