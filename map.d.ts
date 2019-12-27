/**
 * @overview map
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

type IReducer = ((v: any, k: string | number) => any) | string;
declare function map(collection: any, reducer?: IReducer, dst?: any): any;
export = map;
