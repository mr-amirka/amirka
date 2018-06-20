

export const immediate = (fn, args, ctx) => {
  const id = setImmediate(() =>  fn.apply(ctx || null, args || []));
  return () => clearImmediate(id);
};
