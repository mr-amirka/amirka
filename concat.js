
const filter = require('./filter');

module.exports = (src, separator) => filter(src).join(separator || '');
