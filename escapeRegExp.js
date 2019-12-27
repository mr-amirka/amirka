module.exports = (v) => v.replace(reRegExpChar, '\\$&');
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
