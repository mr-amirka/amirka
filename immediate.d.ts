/**
 * @overview immediate
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */
 
import { fn } from "./global";

declare const immediate: (fn: fn | null, args?: any[], ctx?: any) => fn;
export = immediate;
