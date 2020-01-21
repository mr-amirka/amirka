/**
 * @overview jsonParse
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = require('./support')('JSON.parse') || ((v) => {
  return (new Function('return ' + v)).call(null);
});
