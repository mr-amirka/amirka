
declare namespace Emitter {
  export interface watcher<A = any> {
    (v?: A): any;
  }
  export interface PipeHandler<A = any, B = any> {
    (
      getValue: () => A,
      on: (watcher: watcher<B>) => fn
    ): {
      getValue: () => B,
      on?: (watcher: watcher<B>) => fn
    }
  }
}
declare class Pipe <A = any> {
  pipe: <B = any> (...handlers: Emitter.PipeHandler<A, B>[]) => Pipe;
}
declare class Emitter<A> extends Pipe<A> {
  on: (watcher: Emitter.watcher<A>) => fn;
  emit: (value: A) => Emitter<A>;
  getValue: () => A;
  static Pipe: Pipe;
}
export = Emitter;
