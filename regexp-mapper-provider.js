/**
 * @overview regexpMapperProvider
 * @example
 * const mapper = regexpMapperProvider(/^([^\]*)\/([^\]*)$/g, [ 'begin', 'end' ]);
 * var params = {};
 * if (mapper('users/id6574334245', params)) {
 *   console.log(params); // =>
 *   {
 *      begin: 'users',
 *      end: 'id6574334245'
 *   }
 *   return true;
 * }
 * return false;
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

const mapperProvider = require('./mapper-provider');
const isFunction = require('./is-function');
module.exports = (regexp, keys) => {
  const mapper = isFunction(keys) ? keys : mapperProvider(keys);
  return (text, dst) => {
    const values = regexp.exec(text || '');
    if (!values) return false;
    dst && mapper(values, dst);
    return true;
  };
};