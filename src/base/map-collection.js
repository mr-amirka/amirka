/**
 * @overview mapCollection
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {isLength} from 'lodash';

export const mapCollection = (collection, reducer, dst) => {
  let length = collection.length;
  if(isLength(length)){
    dst || (dst = new Array(length));
    for(let i = 0; i < length; i++)dst[i] = reducer(collection[i], i);
    return dst;
  }
  dst|| (dst = {});
  for(let k in collection)dst[k] = reducer(collection[k], k);
  return dst;
};