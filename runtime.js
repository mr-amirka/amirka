const support = require('./support');
const time = require('./time');

module.exports = support('performance.now')
  ? (last => performance.now() - (last || 0))
  : ((start) => {
    return last => time() - start - (last || 0);
  })(time());
