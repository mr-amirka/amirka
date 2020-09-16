const isArrayLike = require('./isArrayLike');
const execute = require('./executeTry');
const each = require('./each');

module.exports = (funcs, args, context) => {
  context || (context = null);
  args || (args = []);
  each(funcs, (fn) => {
    execute(fn, args, context);
  }, isArrayLike(funcs));
};
