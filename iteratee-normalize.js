/**
 * @overview iterateeNormalize
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const isDefined = require('./is-defined');
const isArray = require('./is-array');
const get = require('./get');
const getterProvider = get.getter;

const checkerProvider = ([ path, value ]) => {
  return v => get(v, path) === value;
};

const __iteratee = v => v;

module.exports = (iteratee) => {
  return isDefined(iteratee) ? (
    isArray(iteratee) ? checkerProvider(iteratee) : getterProvider(iteratee)
  ) : __iteratee;
};
