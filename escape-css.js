
module.exports = v => v.replace(regexpEscape, '\\$1');
const regexpEscape = /([[\]#.*^$()><+~=|:,"'`\s])/g;
