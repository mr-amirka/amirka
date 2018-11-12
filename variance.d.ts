/**
 * @overview variance
 * - парсит строку с альтернативными подстроками, получая массив строк
 *
 * @example
 * variance('В(олод|ас)я'); => [ 'Володя', 'Вася' ]
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace variance {
  export interface variance {
  	(exp: string): string[];
  	readonly base: (exp: string) => string[];
  	readonly build: (ast: varianceAst[]) => string[]
  }
  export interface varianceAst {
  	prefix: string;
  	childs?: varianceAst[];
  }
}

declare const variance: variance.variance;
export = variance;
