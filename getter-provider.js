/**
 * @overview getterProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const get = require('./get');
module.exports = (key) => (data) => get(data, key);
