export const once = (fn: fn | null): any => {
  let result: any;
  return function () {
    if (fn) {
      result = fn.apply(this, arguments);
      fn = null;
    }
    return result;
  };
};