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
  function instance() {
    return emit.apply(null, arguments); // eslint-disable-line
  }
  function use(decorator) {
    emit = decorator(emit);
    return instance;
  }
  isFunction(decorators) ? use(decorators) : forEach(decorators, use);
  instance.use = use;
  return instance;
};
