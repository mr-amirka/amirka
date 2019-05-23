/**
 * @overview anyval
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * Преобразовывает значение в число
 */

/**
 * @description
 * @param value {any} - значение
 * @param default? {Number} - значение по умолчанию, если значение нельзя преобразовать
 * @param minValue? {Number} - минимальная допустимая величина
 * @param maxValue? {Number} - максимальная допустимая величина
 *
 * Возвращает число
 *
 * @example
 *
 * _.intval('12'); // => 12
 *
 * _.intval('12', 0, -Infinity, 10); // => 10
 *
 * _.intval('12dsafd', 0, -Infinity, 10); // => 0
 *
 * _.intval('12dsafd', 5, -Infinity, 10); // => 5
 *
 * _.intval('-17', 5, -Infinity, 10); // => -17
 *
 * _.intval('-17', 5, -10, 10); // => -10
 *
 * _.intval(value, default, min, max); // => ...
 */

export declare const intval: (value: any, def?: number, minVal?: number, maxVal?: number) => number;
export declare const floatval: (value: any, def?: number, minVal?: number, maxVal?: number) => number;
