const re = /([A-Z])/g;
const replacer = (all, v) => ('-' + v.toLowerCase());
module.exports = (v) => v.replace(re, replacer);
