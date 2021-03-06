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
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare const joinMaps: (
	dst: {[name: string]: any},
	prefixes: {[name: string]: any},
	suffixes: {[name: string]: any},
	separator?: string
) => {[name: string]: any};
export = joinMaps;
