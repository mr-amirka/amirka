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

/*
const delimeter = '|';
const csvParse = require('mn-utils/csvParse');
const csvStringify = require('mn-utils/csvStringify');

const text = csvStringify([
  ['LS-14', 'Процессинговый Сервис (Processing Service)'],
  ['LS-14', '"Процессинговый Сервис (Processing Service)"'],
  ['LS-14', 'Процессинговый Сервис, (Processing Service)'],
  ['LS-14', 'Процессинговый Сервис; (Processing Service)'],
  ['LS-14', 'Процессинговый Сервис \\" (Processing Service)'],
], delimeter);

console.log({
  text,
  csv: csvParse(text, delimeter),
});
*/
