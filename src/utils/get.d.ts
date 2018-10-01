/**
 * @overview get
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace _get {
  export interface get {
  	(ctx: any, path: string): any;
  	readonly core: (ctx: any, path: string[]) => any;
  }
}
declare const get: _get.get;
export = get;
