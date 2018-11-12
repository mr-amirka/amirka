/**
 * @overview param
 * - конструктор GET парметров url
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace param {
  export interface param {
    (v: any, excludePrefix?: string): string;
    escape: (v: string) => string;
  }
}
declare const param: param.param;
export = param;
