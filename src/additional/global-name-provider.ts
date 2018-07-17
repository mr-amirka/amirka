/**
 * @overview globalNameProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


import {uniqueId} from 'lodash';
import {_global} from './_global';

export const globalNameProvider = (scope?: any, prefix?: string) => {
  scope || (scope = _global);
  prefix || (prefix = 'CALLBACK_');
  return (fn: fn, ctx?: any) => {
    const name = uniqueId(prefix);
    scope[name] = function (){
      const res = fn.apply(ctx || scope, arguments);
      delete scope[name];
      return res;
    };
    return name;
  }
};
