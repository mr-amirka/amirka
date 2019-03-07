
const map = require('./map');
module.exports = (fns, args, ctx) => map(fns, fn => fn.apply(ctx, args));
