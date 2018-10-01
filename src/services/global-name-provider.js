/**
 * @overview globalNameProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const _global = require('./_global');

let _id = 0;
module.exports = (scope, prefix) => {
  scope || (scope = _global);
  prefix || (prefix = 'CALLBACK_');
  return (fn, ctx) => {
    _id++;
    const name = prefix + _id;
    scope[name] = function() {
      const res = fn.apply(ctx || scope, arguments);
      delete scope[name];
      return res;
    };
    return name;
  }
};
