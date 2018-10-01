const { isArray, isString } = require("./utils");

module.exports = (attrs) => {
  if (!attrs) return null;
  isString(attrs) && (attrs = attrs.split(regexpAttrsSplit));
  if (!isArray(attrs)) return null;
  attrs = attrs.filter(__attrFilter);
  if (attrs.length < 1) return null;
  //const regexp = /m=("([^"]+)"|'([^']+)')/gm;
  const regexp = new RegExp('\\s+(' + attrs.join('|') + ')=("([^"]+)"|\'([^\']+)\')', 'gm');
  return (attrsMap, text) => {
    let count = 0;
    text.replace(regexp, (all, attrName, vWrap, v1, v2) => {
      const essencesMap = attrsMap[attrName] || (attrsMap[attrName] = {});
      (v1 || v2).split(regexpSpace).forEach((name) => {
        count++;
        (essencesMap[name] || (essencesMap[name] = {
          name,
          count: 0
        })).count++;
      });
    });
    return count;
  };
};
const regexpSpace = /\s+/;
const regexpAttrsSplit = /[\s|,]+/;
const __attrFilter = v => v;
