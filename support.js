/**
 * @overview support
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const cache = {};
module.exports = (varName) =>
  (cache[varName] || (cache[varName] = new Function('try{return ' + varName + ';}catch(ex){}')))();
