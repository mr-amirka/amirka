
declare const map: <A = any, B = any, S = any> (_mapFn: (v: A) => B) => ((
  getValue: () => A,
  on: (watcher: (v: B) => any) => S
) => {
  getValue: () => B
})
export = map;
