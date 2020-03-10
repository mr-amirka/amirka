/**
 * @overview Emitter
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @description
 * альтернатива rxjs
 */

import {cancel} from "../global";
import {Emitter} from "./emitter";

declare function emitterProvider(
  initial: ((emit: (v: any) => void) => cancel | any) | any,
  defaultInitial: any,
): Emitter<any>;
export = emitterProvider;
