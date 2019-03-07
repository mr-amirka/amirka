const immediate = require('../immediate');
const noop = require('../noop');
const Deal = require('../deal');
const isPromise = require('../isPromise');

module.exports = (checkFn, statementFn, __immediate) => {
  __immediate || (__immediate = immediate);
  return new Deal((resolve, reject) => {
    let cancel = noop;
    const next = () => {
      try {
        if (checkFn()) {
          const result = statementFn();
          cancel = isPromise(result) ? result.then(next, reject).cancel || noop : __immediate(next);
        } else resolve();
      } catch (ex) {
        reject(ex);
      }
    };

    next();
    return () => {
      cancel();
    };

  }, __immediate);
};
