const isString = require('./is-string');
module.exports = (v, length) => !isString(v) || v.length < length;
