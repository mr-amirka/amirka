module.exports = (fn, args, context) => {
  try {
    return fn.apply(context, args || []);
  } catch (ex) {
    console.error(ex);
  }
};
