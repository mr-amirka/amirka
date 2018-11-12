/**
 * @overview eachTry
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isLength = require('./is-length');
module.exports = (funcs, args, context) => {
  const length = funcs && funcs.length;
  if (isLength(length)) {
    for (let i = 0; i < length; i++) execute(funcs[i], args, context);
  } else {
    for (let k in funcs) execute(funcs[k], args, context);
  }
};
const execute = (fn, args, context) => {
  try {
    fn.apply(context, args);
  } catch (ex) {
    console.error(ex);
  }
};
