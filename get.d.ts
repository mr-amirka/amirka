/**
 * @overview get
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

declare namespace _get {
  export interface get {
  	(ctx: any, path: string, def?: any): any;
  	readonly base: (ctx: any, path: string[], def?: any) => any;
  }
}
declare const get: _get.get;
export = get;
