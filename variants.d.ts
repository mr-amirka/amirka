/**
 * @overview variants
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

interface IVariants {
  (exp: string): string[];
  readonly base: (exp: string) => string[];
  readonly build: (ast: IVariantsAst[]) => string[];
}
interface IVariantsAst {
  prefix: string;
  childs?: IVariantsAst[];
}

/**
 * @desctiption
 * Парсит строку с альтернативными подстроками, возвращая массив строк
 *
 * @example
 * ```js
 * variants('В(олод|ас)я'); // => [ 'Володя', 'Вася' ]
 *
 * variants('((|p)re|de|un)(build|cod)(|er|ing)');
 * // => [
 * // 'rebuild', 'rebuilder', 'rebuilding', 'recod', 'recoder', 'recoding',
 * // 'prebuild', 'prebuilder', 'prebuilding', 'precod', 'precoder', 'precoding',
 * // 'debuild', 'debuilder', 'debuilding', 'decod', 'decoder', 'decoding',
 * // 'unbuild', 'unbuilder', 'unbuilding', 'uncod', 'uncoder', 'uncoding',
 * // ]
 * ```
 */
declare const variants: IVariants;
export = variants;
