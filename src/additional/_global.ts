/**
 * @overview _global
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import {support} from "../base/support";
export const _global = support('global') || support('window') || support('this');
