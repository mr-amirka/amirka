/**
 * @overview _global
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const support = require('./support');
module.exports = support('global') || support('window') || support('self')
  || support('this');
