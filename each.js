const forEach = require('./forEach');
const forIn = require('./forIn');

module.exports = (collection, iteratee, hasArray) => {
  ((hasArray || collection && (collection instanceof Array))
    ? forEach : forIn)(collection, iteratee);
};
