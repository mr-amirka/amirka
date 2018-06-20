/**
 * @overview joinArrays
 * @example
 *
 * joinArrays([], ['Володя', 'Вася'], ['стоит', 'бежит'], ' '); // =>
 * [
 * 	'Володя стоит', 'Вася стоит', 'Володя бежит', 'Вася бежит'
 * ]
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

export const joinArrays = (output, prefixes, suffixes, separator) => {
	separator || (separator = '');
	const pl = prefixes.length;
  for (let prefix, si, sl, pi = 0; pi < pl; pi++) {
    for (prefix = prefixes[pi] + separator, sl = suffixes.length, si = 0; si < sl; si++) {
      output.push(prefix + suffixes[si]);
    }
  }
  return output;
};


