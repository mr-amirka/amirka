/**
 * @overview responsibilityChain
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

declare namespace responsibilityChain {
  export interface ChainHandler {
    (req: any, next: ChainHandler): any;
  }
}
declare const responsibilityChain: (chain: responsibilityChain.ChainHandler[], req: any, end: fn) => any;
export = responsibilityChain;
