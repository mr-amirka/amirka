
const splitProvider = require('../splitProvider');
const flags = require('../flags');
const getKeys = require('../keys');

const _split = splitProvider(/\s+/);

exports.getClassMap
  = (className, dst) => flags(className && _split(className), dst);
exports.setClass = (node, className, hasActive) => {
  const classMap = getClassMap(node.className);
  if (!classMap[className] === !hasActive) return;
  if (hasActive) {
    classMap[className] = true;
  } else {
    delete classMap[className];
  }
  node.className = getKeys(classMap).join(' ');
};
