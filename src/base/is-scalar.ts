/**
 * @overview isScalar
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isOwner} from "./is-owner";
export const isScalar = (v: any) => !isOwner(v);
