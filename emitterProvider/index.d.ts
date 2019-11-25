import {cancel} from "../global";
import {Emitter} from "./emitter";

declare function emitterProvider(
  initial: ((emit: (v: any) => void) => cancel | any) | any,
  defaultInitial: any,
): Emitter;
export = emitterProvider;
