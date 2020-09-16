module.exports = require('./CancelablePromiseProvider')({
  defer: require('./defer'),
  ParentClass: require('./support')('Promise'),
});
