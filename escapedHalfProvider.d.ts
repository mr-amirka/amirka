/**
 * @overview escapedHalfProvider
 * Возвращает функцию, которая разбивает строку на две части в том месте,
 * где находит разделяющую подстроку separator.
 * Игнорирует разделилель, если он экранрован слэшем (\)
 *
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

declare namespace escapedHalfProvider {
  export interface escapedhalfResult {
    prefix: string,
    suffix: string,
    value: string
  }
  export interface escapedhalf {
    (input: string): escapedhalfResult;
    core: escapedhalfCore;
  }
  export interface escapedhalfCore {
    (input: string): escapedhalfResult;
  }
}
declare const escapedHalfProvider: (separator: string | RegExp) => escapedHalfProvider.escapedhalf;
export = escapedHalfProvider;
