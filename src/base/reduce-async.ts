/**
 * @overview reduceAsync
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

import { isLength } from './is-length';

export interface reducer {
	(v: any, k: string | number, done: done): any
}
export interface done {
	(v: any): any
}
export interface progress {
	(v: progressEvent): any
}
export interface progressEvent {
	loaded: number;
	total: number;
	childs?: {
		[key: string]: progressEvent
	}
}
export const reduceAsync = (src: any, reducer: reducer, done?: done, dst?: any, progress?: progress): any => {
	let loaded = 0;
	done || (done = noop);
	progress || (progress = noop);
	const step = (k: string | number) => {
		let isDone: boolean;
		reducer(src[k], k, (v: any) => {
			if (isDone) return;
			isDone = true;
			dst[k] = v;
			progress({loaded, total});
			++loaded < total || done(dst);
		});
	};
  let total = src.length;
  if (isLength(total)) {
    dst || (dst = new Array(total));
    if (total < 1) return done(dst);
    for (let i = 0; i < total; i++) step(i);
    return;
  }
  dst || (dst = {});
  if ((total = Object.keys(src).length) < 1) return done(dst)
  for (let k in src) step(k);
};
const noop = (v: any) => v;