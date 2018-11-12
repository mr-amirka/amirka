/**
 * @overview unparam
 * - парсит GET-параметры URL
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace unparam {
  export interface unparam {
    (s: string): any;
    base: (s: string) => any;
  }
}
declare const unparam: unparam.unparam;
export = unparam;
