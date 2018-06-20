/**
 * @overview isCollection
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {set, get, extend, isPlainObject} from "lodash";

export const extendByPathsMap = (dst, src, map) => {
  if(!map)return dst;
  if(typeof map !== 'object')return get(src, map);
  let to, from, v, i;
  for(to in map){
    from = map[to];
    if((v = from === '' ? src : get(src, from)) === undefined)continue;
    if(to){
      set(dst, to, v);
    }else{
      if(isPlainObject(v))extend(dst, v);
    }
  }
  return dst;
};