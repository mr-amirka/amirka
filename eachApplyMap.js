
const map = require('./map');
module.exports = (fns, args, ctx) => {
  context || (context = null);
  args || (args = []);
  return map(fns, fn => fn.apply(ctx, args));
};
