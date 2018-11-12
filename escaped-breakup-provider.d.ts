/**
 * @overview escapedBreakupProvider
 * Возвращает функцию, которая разбивает строку на две части в том месте,
 * где находит разделяющую подстроку separator.
 * Игнорирует разделилель, если он экранрован слэшем (\)
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

declare namespace escapedBreakupProvider {
  export interface escapedBreakupResult {
    prefix: string,
    suffix: string,
    value: string
  }
  export interface escapedBreakup {
    (input: string): escapedBreakupResult;
    core: escapedBreakupCore;
  }
  export interface escapedBreakupCore {
    (input: string): escapedBreakupResult;
  }
}
declare const escapedBreakupProvider: (separator: string | RegExp) => escapedBreakupProvider.escapedBreakup;
export = escapedBreakupProvider;
