/**
 * @overview joinArrays
 * @example
 *
 *  joinArrays([], ['Володя', 'Вася'], ['стоит', 'бежит'], ' '); // =>
 *  [
 *    'Володя стоит', 'Вася стоит', 'Володя бежит', 'Вася бежит'
 *  ]
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

module.exports = (output, prefixes, suffixes, separator) => {
  separator = separator || '';
  const pl = prefixes.length;
  let prefix, si, sl, pi = 0; // eslint-disable-line
  for (; pi < pl; pi++) { // eslint-disable-line
    // eslint-disable-next-line
    for (prefix = prefixes[pi] + separator, sl = suffixes.length, si = 0; si < sl; si++) {
      output.push(prefix + suffixes[si]);
    }
  }
  return output;
};
