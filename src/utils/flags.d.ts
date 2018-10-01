/**
 * @overview flags
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 * flags([ 'apple', 'ban', 'test.use' ]); // =>
 * {
 *   apple: true,
 *   ban: true,
 *   test: {
 *     use: true
 *   }
 * }
 *
 */

declare namespace flags {
  export interface flags {
    (flags: string[], dst?: any): FlagsMap;
    simple: (flags: string[], dst?: any) => FlagsMap;
  }
}
declare const flags: flags.flags;
export = flags;
