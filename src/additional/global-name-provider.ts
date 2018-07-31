/**
 * @overview globalNameProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { _global } from './_global';

let _id = 0;
export const globalNameProvider = (scope?: any, prefix?: string) => {
  scope || (scope = _global);
  prefix || (prefix = 'CALLBACK_');
  return (fn: fn, ctx?: any) => {
    _id++;
    const name = (<string> prefix) + _id;
    scope[name] = function (){
      const res = fn.apply(ctx || scope, arguments);
      delete scope[name];
      return res;
    };
    return name;
  }
};
