const isString = require('./is-string');
module.exports = (v, length) => isString(v) && v.length === (length || 32) && !!regexp.test(v);
const regexp = /^[0-9a-f]+$/;
