import {cancel} from "../global";

export declare class Emitter<T> {
  public on(watcher: (v: T) => any): cancel;
  public emit(value: T): void;
  public getValue(): T;
}
