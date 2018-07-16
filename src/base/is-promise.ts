/**
 * @overview isPromise
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

import { isOwner } from './is-owner';

export const isPromise = (v: any) => isOwner(v) && typeof v.then === 'function';
