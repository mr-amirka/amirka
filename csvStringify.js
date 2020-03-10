const isObject = require('./isObject');
const map = require('./map');
const escapeRegExp = require('./escapeRegExp');

const regexpSpace = /^\s+|\s+$/;

module.exports = (v, delimeter) => {
  delimeter = delimeter || ';';
  const regexpSpecial
    = new RegExp('([,;"\\\\' + escapeRegExp(delimeter) + '])', 'g');

  function iteratee(v) {
    return regexpSpace.test(v = v.replace(regexpSpecial, '\\$1'))
      ? ('"' + v + '"')
      : v;
  }
  return isObject(v) ? map(v, (v) => {
    return isObject(v) ? map(v, iteratee, []).join(delimeter) : ('' + v);
  }, []).join('\n') : '';
};
