const immediate = require('../defer');
const noop = require('../noop');
const Deal = require('../CancelablePromise');
const isPromise = require('../isPromise');

module.exports = (checkFn, statementFn, __immediate) => {
  __immediate || (__immediate = immediate);
  return new Deal((resolve, reject) => {
    let _cancel = noop;
    function next() {
      try {
        if (checkFn()) {
          const result = statementFn();
          _cancel = isPromise(result)
            ? result.then(next, reject).cancel || noop
            : __immediate(next);
        } else resolve();
      } catch (ex) {
        reject(ex);
      }
    }

    next();
    return () => {
      _cancel();
    };
  }, __immediate);
};
