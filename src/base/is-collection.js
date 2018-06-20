/**
 * @overview isCollection
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import { isLength } from 'lodash';
export const isCollection = v => v && (typeof v === 'object') && (!Object.getPrototypeOf(v) || isLength(v.length));

