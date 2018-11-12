const isRegExp = require('./is-reg-exp');
const escapeRegExp = require('./escape-reg-exp');

module.exports = (pattern) => {
  const p = isRegExp(pattern) ? pattern.toString().replace(regexpRegexpTrim, '') : escapeRegExp(pattern);
  const regexp = new RegExp('^(' + p + ')+|(' + p + ')+$', 'g');
  return v => v && v.replace(regexp, '');
};
const regexpRegexpTrim = /^\/|\/[^\/]*$/g;
