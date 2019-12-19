const delay = require('./delay');

module.exports = (fn, args, ctx) => {
  try {
    const immediateId = setImmediate(() => {
      fn.apply(ctx || null, args || []);
    });
    return () => {
      clearImmediate(immediateId);
    };
  } catch (ex) {
    return delay(fn, 0, args, ctx);
  }
};
