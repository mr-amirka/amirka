/**
 * @overview splitProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */


/**
* @example
* const getPath = splitProvider('.');
* getPath('info.phone') // => [ 'info' , 'phone' ]
*/
declare const splitProvider: (delimeter: string | RegExp) => ((str: string) => string[]);
export = splitProvider;
