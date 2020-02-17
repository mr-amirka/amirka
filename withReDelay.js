/**
 * @overview delayOne
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const delay = require('./delay');
const single = require('./single');
module.exports = (fn, _delay, ctx) => single(function() {
  return delay(fn, _delay, arguments, ctx || this); // eslint-disable-line
});
