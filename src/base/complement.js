/**
 * @overview extendEnd
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {isPlainObject} from 'lodash';
import {isOwner} from './is-owner';

export const complement = (dst, src, depth) => {
  depth || (depth = 0);
  if (depth < 0 || !isPlainObject(src)) return dst === undefined ? src : dst;
  if (!isOwner(dst)) {
    if (dst !== undefined) return dst;
    dst = {};
  }
  __complement(dst, src, depth);
  return dst;
};
const __complement = complement.core = (dst, src, depth) => {
  depth--;
  let k, to, from, dp = depth > -1;
  for (k in src) {
    if ((from = src[k]) === undefined) continue;
    if ((to = dst[k]) === undefined) {
      if (dp && isPlainObject(from)) {
        __complement(dst[k] = {}, from, depth);
      } else {
        dst[k] = from;
      }
      continue;
    }
    if (dp && isOwner(to) && isPlainObject(from)) __complement(to, from, depth);
  }
  return dst;
};