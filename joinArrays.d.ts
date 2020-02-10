/**
 * @overview joinArrays
 * @example
 *
 * joinArrays([], ['Володя', 'Вася'], ['стоит', 'бежит'], ' '); // =>
 * [
 * 	'Володя стоит', 'Вася стоит', 'Володя бежит', 'Вася бежит'
 * ]
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare const joinArrays: (output: string[], prefixes: string[], suffixes: string[], separator?: string) => string[];
export = joinArrays;
