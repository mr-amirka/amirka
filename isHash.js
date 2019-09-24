const isString = require('./isString');
module.exports = (v, length) => isString(v) && v.length === (length || 32) && !!regexp.exec(v);
const regexp = /^[0-9a-f]+$/;
