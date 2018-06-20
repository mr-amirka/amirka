/**
 * @overview responsibilityChain
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */
import {once} from 'lodash';

export const responsibilityChain = (chain, req, res, end) => {
  let i = 0;
  const length = chain.length;
  const next = () => {
    if (!(i < length)) return end(req, res);
    const handler = chain[i++];
    const _next = once(next);
    try {
      handler.apply(chain, [req, res, _next]);
    } catch (ex) {
      console.error(ex);
      _next();
    }
  };
  next();
};