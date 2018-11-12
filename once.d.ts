/**
 * @overview once
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

import { fn } from "./global";

declare const once: (fn: fn | null) => fn;
export = once;
