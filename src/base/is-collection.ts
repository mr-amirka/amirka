/**
 * @overview isCollection
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { isLength } from 'lodash';
export const isCollection = (v: any) => v && (typeof v === 'object') && (!Object.getPrototypeOf(v) || isLength(v.length));

