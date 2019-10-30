/**
 * @overview iterateeNormalize
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const isDefined = require('./isDefined');
const isArray = require('./isArray');
const get = require('./get');
const getBase = get.base;
const getterProvider = get.getter;

function checkerProvider([ path, value ]){
  const _path = isArray(path) ? path : ('' + path).split('.');
  return v => getBase(v, _path) === value;
}
const __iteratee = v => v;

module.exports = (iteratee) => {
  return isDefined(iteratee)
    ? (isArray(iteratee) ? checkerProvider(iteratee) : getterProvider(iteratee))
    : __iteratee;
};