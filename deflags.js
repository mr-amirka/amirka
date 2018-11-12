
const filter = require('./filter');

module.exports = (flags) => Object.keys(filter(flags));
