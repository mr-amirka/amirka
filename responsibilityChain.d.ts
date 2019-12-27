/**
 * @overview responsibilityChain
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

import {fn} from "./global";

type IChainHandler = (req: any, next: IChainHandler) => any;

declare function responsibilityChain(chain: IChainHandler[], req: any, end: fn): any;
export = responsibilityChain;
