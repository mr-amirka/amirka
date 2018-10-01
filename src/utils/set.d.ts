/**
 * @overview set
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace set {
  export interface set {
    (ctx: any, path: string, value: any): any;
    readonly core: (ctx: any, path: string[], value: any) => any;
  }
}
declare const set: set.set;
export = set;
