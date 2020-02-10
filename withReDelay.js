/**
 * @overview delayOne
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const delay = require('./delay');
const single = require('./single');
module.exports = (fn, _delay) => single(function() {
  return delay(fn, _delay, arguments, this);
});
