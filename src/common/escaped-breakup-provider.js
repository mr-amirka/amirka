/**
 * @overview escapedBreakupProvider
 * Возвращает функцию, которая разбивает строку на две части в том месте,
 * где находит разделяющую подстроку separator.
 * Игнорирует разделилель, если он экранрован слэшем (\) 
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import {escapeRegExp, isRegExp} from 'lodash';

export const escapedBreakupProvider = (separator) => {
  if (isRegExp(separator)) {
    separator = separator.toString();
    separator = separator.substr(1, separator.length - 2);
  } else {
    separator = escapeRegExp(separator);
  }
  const regexp = new RegExp('(\\\\.)|(' + separator + '(.*)$)', 'g');
  return (input) => {
    let prefix = input; 
    let suffix = '';
    let value = '';
    input.replace(regexp, (all, escaped, _suffix, _value, offset) => {
      if (escaped) return;
      suffix = _suffix;
      value = _value;
      prefix = input.substr(0, offset);
    });
    return {prefix, suffix, value};
  };
};