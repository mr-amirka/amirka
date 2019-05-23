/**
 * @overview anyval
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * Преобразовывает значение в число
 */

/**
 * @description
 * Возвращает число
 *
 * @param value {any} - значение
 * @param default? {Number} - значение по умолчанию, если значение нельзя преобразовать
 * @param minValue? {Number} - минимальная допустимая величина
 * @param maxValue? {Number} - максимальная допустимая величина
 *
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


const normalize = (value, minVal, maxVal) => {
  if (minVal !== undefined && value < minVal) value = minVal;
  if (maxVal !== undefined && value > maxVal) value = maxVal;
  return value;
};
const anyValProvider = (parse) => {
  return (value, def, minVal, maxVal) => {
    if (typeof value === 'boolean') return normalize(value ? 1 : 0, minVal, maxVal);
    return isNaN(value = parse(value)) ? (def || 0) : normalize(value, minVal, maxVal);
  };
};
module.exports.intval = anyValProvider(parseInt);
module.exports.floatval = anyValProvider(parseFloat);
