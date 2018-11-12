/**
 * @overview cloneDepth
 * Копирует объект до определенной вторым аргументом глубины
 *
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace cloneDepth {
  interface cloneDepth {
    (src: any, depth?: number): any;
    readonly base: (src: any, depth: number) => any;
  }
}

declare const cloneDepth: cloneDepth.cloneDepth;
export = cloneDepth;
