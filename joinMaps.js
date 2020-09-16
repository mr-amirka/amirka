/**
 * @overview joinMaps
 * @example
 *
 *  joinMaps({}, {'Володя': 1, 'Вася': 1}, {'стоит': 1, 'бежит': 1}, ' '); // =>
 *  {
 *    'Володя стоит': 1,
 *    'Вася стоит': 1,
 *    'Володя бежит': 1,
 *    'Вася бежит': 1
 * }
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (dst, prefixes, suffixes, separator) => {
  separator || (separator = '');
  let prefix, suffix, p; // eslint-disable-line
  for (prefix in prefixes) { // eslint-disable-line
    p = prefix + separator;
    for (suffix in suffixes) dst[p + suffix] = 1; // eslint-disable-line
  }
  return dst;
};
