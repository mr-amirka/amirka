/**
 * @overview _global
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const support = require('./support');
module.exports = support('global') || support('window') || support('self')
  || support('this');
