const deflags = require('./deflags');
module.exports = (src, suffix) => deflags(src).join(' ')
  + (suffix ? (' ' + suffix) : '');
