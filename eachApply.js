/**
 * @overview eachApply
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./isLength');
module.exports = (funcs, args, context) => {
  const length = funcs && funcs.length;
  if (isLength(length)) {
    for (let i = 0; i < length; i++) funcs[i].apply(context, args);
  } else {
    for (let k in funcs) funcs[k].apply(context, args);
  }
};
