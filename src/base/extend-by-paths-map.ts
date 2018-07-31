/**
 * @overview extendByPathsMap
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {set, get, extend, isPlainObject} from "lodash";

export const extendByPathsMap = (dst: object, src: object, map: Map<string, string>) => {
  if (!map) return dst;
  if (typeof map !== 'object') return get(src, map);
  let to, from, v;
  for (to in map) {
    from = map[to];
    if ((v = from === '' ? src : get(src, from)) === undefined) continue;
    if (to) {
      set(dst, to, v);
    } else {
      if (isPlainObject(v)) extend(dst, v);
    }
  }
  return dst;
};