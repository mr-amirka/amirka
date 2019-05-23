/**
 * @overview decorate
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

/*
@example
const wrappedFn = decorate(innerFn);
wrappedFn.use((innerFn) => (args) => {
  console.log('dynamic log: ', args);
  return innerFn(args)
});
*/

const isFunction = require('./isFunction');
const forEach = require('./forEach');

module.exports = (emit, decorators) => {
  const instance = function() {
    return emit.apply(null, arguments);
  };
  const use = instance.use = (decorator) => {
    emit = decorator(emit);
    return instance;
  };
  isFunction(decorators) ? use(decorators) : forEach(decorators, use);
  return instance;
};
