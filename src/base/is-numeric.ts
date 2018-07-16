/**
 * @overview isNumeric
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {isFinite} from "lodash";
export const isNumeric = (v: any) => !isNaN(v = parseFloat(v)) && isFinite(v);