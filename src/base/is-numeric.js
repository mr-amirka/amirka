/**
 * @overview isNumeric
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {isFinite} from "lodash";
export const isNumeric = v => !isNaN(v = parseFloat(v)) && isFinite(v);