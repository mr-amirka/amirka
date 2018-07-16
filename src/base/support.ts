/**
 * @overview support
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const cache = {};

export const support = (varName: string): any => {
  return (cache[varName] || (cache[varName] = new Function('try{return ' + varName + ';}catch(ex){}')))();
};