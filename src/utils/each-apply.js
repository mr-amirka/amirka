/**
 * @overview eachApply
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (funcs, args, context) => funcs.forEach(fn => fn.apply(context, args));
