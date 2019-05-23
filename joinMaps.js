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
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (dst, prefixes, suffixes, separator) => {
	separator || (separator = '');
  let prefix, suffix, p;
  for (prefix in prefixes) {
    p = prefix + separator;
    for (suffix in suffixes) dst[p + suffix] = true;
  }
  return dst;
};
