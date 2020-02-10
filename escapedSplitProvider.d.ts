/**
 * @overview escapedSplitProvider
 * Разбивает строку на подстроки с учетом экранирования служебного символа
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

declare namespace escapedSplitProvider {
  export interface escapedSplit {
  	(input: string, dstSeparators?: string[]): string[];
  	core: (input: string, dstSeparators?: string[]) => string[];
  }
}

declare const escapedSplitProvider: (separator: string | RegExp) => escapedSplitProvider.escapedSplit;
export = escapedSplitProvider;
