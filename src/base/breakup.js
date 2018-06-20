/**
 * @overview breakup
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const breakupProvider = (indexOf) => (input, v, right) => {
  const i = indexOf.call(input, v);
  return i < 0 ? (right ? [ '',  input ] : [ input, '' ]) : [ input.substr(0, i), input.substr(i + v.length) ];
};

export const breakup = breakupProvider(''.indexOf);
export const breakupLast = breakup.last = breakupProvider(''.lastIndexOf);