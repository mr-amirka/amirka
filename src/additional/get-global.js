/**
 * @overview getGlobal
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {support} from "./support";
const g = support('global') || support('window') || support('this');
export const getGlobal = () => g;
