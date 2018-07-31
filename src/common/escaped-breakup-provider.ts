/**
 * @overview escapedBreakupProvider
 * Возвращает функцию, которая разбивает строку на две части в том месте,
 * где находит разделяющую подстроку separator.
 * Игнорирует разделилель, если он экранрован слэшем (\) 
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import {escapeRegExp, isRegExp, map} from 'lodash';
import {unslash} from './unslash';

interface escapedBreakupResult {
  prefix: string,
  suffix: string,
  value: string
}
export interface escapedBreakup {
  (input: string): escapedBreakupResult;
  core: escapedBreakupCore;
}

export interface escapedBreakupCore {
  (input: string): escapedBreakupResult;
}

export const escapedBreakupProvider = (separator: string | RegExp): escapedBreakup => {
  if (isRegExp(separator)) {
    separator = separator.toString();
    separator = separator.substr(1, separator.length - 2);
  } else {
    separator = escapeRegExp(separator);
  }
  const regexp = new RegExp('(\\\\.)|(' + separator + '(.*)$)', 'g');
  const instance:escapedBreakup = <escapedBreakup> ((input: string) => (<any> map(core(input), unslash)));
  const core = (<any> instance).core = (input: string): escapedBreakupResult => {
    let prefix = input; 
    let suffix = '';
    let value = '';
    input.replace(regexp, (all, escaped, _suffix, _value, offset) => {
      if (escaped) return '';
      suffix = _suffix;
      value = _value;
      prefix = input.substr(0, offset);
      return '';
    });
    return {prefix, suffix, value};
  };
  return instance;
};