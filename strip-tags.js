

module.exports = v => v && __replace(__replace(__replace(v, regexpStripTags, ' '), regexpTrim, ''), regexpSpace, ' ');
const regexpStripTags = /(<[A-Za-z0-9]+('[^']+'|"[^"]+"|[^>])*\/?>|<\/[A-Za-z0-9]+>)/g;
const regexpSpace = /\s+/g;
const regexpTrim = /^\s+|\s+$/g;
const __replace = (v, from, to) => v.replace(from, to);
