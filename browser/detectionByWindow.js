const get = require('../get');
const addOf = require('../addOf');
const detection = require('./detection');

module.exports = (window, output) => {
  output = output || [];
  window.orientation && addOf(output, 'orientation');
  return detection(get(window, 'navigator.userAgent'), output);
};
