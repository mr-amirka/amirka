/**
 * @overview extendDepth
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

declare namespace extendDepth {
  export interface extendDepth {
    (dst: any, src: any, depth?: number): any;
    readonly core: (dst: any, src: any, depth: number) => any;
  }
}
declare const extendDepth: extendDepth.extendDepth;
export = extendDepth;
