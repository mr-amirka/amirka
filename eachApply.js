/**
 * @overview eachApply
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isLength = require('./isLength');
module.exports = (funcs, args, context) => {
  context || (context = null);
  args || (args = []);
  const length = funcs && funcs.length;
  let i;
  if (isLength(length)) {
    for (i = 0; i < length; i++) funcs[i].apply(context, args);
  } else {
    for (i in funcs) funcs[i].apply(context, args); // eslint-disable-line
  }
};
