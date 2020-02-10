/**
 * @overview colorRange
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

/**
 * @example
 * rangeColors(['#F00', '#0F0', '#00F'], 4); //=> ['#F00', '#0F0', '#0F0', '#00F']
 */
declare function colorRange(colors: Array<string | number[]>, precision?: number): string[];
export = colorRange;
