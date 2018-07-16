/**
 * @overview joinMaps
 * @example
 *
 * joinMaps({}, {'Володя': true, 'Вася': true}, {'стоит': true, 'бежит': true}, ' '); // =>
 * {
 * 	'Володя стоит': true,
 * 	'Вася стоит': true,
 * 	'Володя бежит': true,
 * 	'Вася бежит': true
 * }
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const joinMaps = (
	dst: {[name: string]: any}, 
	prefixes: {[name: string]: any},
	suffixes: {[name: string]: any},
	separator?: string
) => {
	separator || (separator = '');
  let prefix, suffix, p;
  for (prefix in prefixes) {
    p = prefix + separator;
    for (suffix in suffixes) {
    	dst[p + suffix] = true;
    }
  }
  return dst;
};
