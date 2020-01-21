/**
 * @overview JSON
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = require('./support')('JSON') || {
  stringify: require('./jsonStringify'),
  parse: require('./jsonParse'),
};
