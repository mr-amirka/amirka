/**
 * @overview eachTry
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isLength = require('./isLength');
const execute = require('./executeTry');
module.exports = (funcs, args, context) => {
  context || (context = null);
  args || (args = []);
  const length = funcs && funcs.length;
  if (isLength(length)) {
    for (let i = 0; i < length; i++) execute(funcs[i], args, context);
  } else {
    for (let k in funcs) execute(funcs[k], args, context);
  }
};
