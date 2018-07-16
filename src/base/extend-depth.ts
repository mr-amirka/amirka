/**
 * @overview extendDepth
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { isPlainObject } from 'lodash';
import { isOwner } from './is-owner';

interface extendDepth {
  (dst: any, src: any, depth?: number): any;
  readonly core: (dst: any, src: any, depth: number) => any;
}

export const extendDepth = <extendDepth> ((dst, src, depth) => {
  if (src === undefined) return dst;
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return src;
  __extendDepth(isOwner(dst) ? dst : (dst = {}), src, depth);
  return dst;
});
const __extendDepth = (<any> extendDepth).core = (dst: any, src: any, depth: number) => {
  depth--;
  let k, to, from, dp = depth > -1;
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if (dp && isPlainObject(from)) {
      __extendDepth(isOwner(to = dst[k]) ? to : (dst[k] = {}), from, depth);
      continue
    }
    dst[k] = from;
  }
};