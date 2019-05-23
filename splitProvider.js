/**
 * @overview splitProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const __split = ''.split;

/**
* @example
* const getPath = splitProvider('.');
* getPath('info.phone') // => [ 'info' , 'phone' ]
*/
module.exports = delimeter => src => __split.call(src, delimeter);
