
const eachApply = require('./each-apply');
module.exports = (subscriptions) => () => {
  if (subscriptions) {
    eachApply(subscriptions);
    subscriptions = null;
  }
};
