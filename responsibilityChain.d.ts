/**
 * @overview responsibilityChain
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare namespace responsibilityChain {
  export interface ChainHandler {
    (req: any, next: ChainHandler): any;
  }
}
declare const responsibilityChain: (chain: responsibilityChain.ChainHandler[], req: any, end: fn) => any;
export = responsibilityChain;
