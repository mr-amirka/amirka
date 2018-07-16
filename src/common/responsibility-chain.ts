/**
 * @overview responsibilityChain
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
import {once} from 'lodash';


interface ChainHandler {
  (req: any, next: ChainHandler): any;
}


export const responsibilityChain = (chain: ChainHandler[], req: any, end: fn) => {
  const next = (_req: any, i: number): any => {
    const handler = chain[i];
    if (!handler) return end(_req);
    const ni = i + 1;
    try {
      return handler(_req, (req) => next(req || _req, ni));
    } catch (ex) {
      console.error(ex);
      return next(_req, ni);
    }
  };
  return next(req, 0);
};