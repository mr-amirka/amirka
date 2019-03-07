
const eachApply = require('./eachApply');
module.exports = (subscriptions) => () => {
  if (subscriptions) {
    eachApply(subscriptions);
    subscriptions = null;
  }
};
