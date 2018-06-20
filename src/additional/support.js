/**
 * @overview support
 * @author Absalutely Amir <mr.amirka@ya.ru>
 */

const cache = {};

export const support = (varName) => {
  return (cache[varName] || (cache[varName] = new Function('try{return ' + varName + ';}catch(ex){}')))();
};