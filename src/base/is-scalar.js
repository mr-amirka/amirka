/**
 * @overview isScalar
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {isOwner} from "./is-owner";
export const isScalar = v => !isOwner(v);
