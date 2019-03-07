/**
 * @overview cssPropertiesStringifyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

 const camelToKebabCase = require("./camelToKebabCase");
 const isArray = require("./isArray");

module.exports = (prefixedAttrs, prefixes) => {
  prefixedAttrs || (prefixedAttrs = {});
  prefixes || (prefixes = {});
  const stringify = (props) => {
    let output = [], vs, vl, vi, prop, prefix, propPrefix, propertyName;
    for (propertyName in props) {
      propPrefix = camelToKebabCase(propertyName) + ':';
      if (!isArray((vs = props[propertyName]))) vs = [ vs ];
      if (prefixedAttrs[propertyName]) {
        for (vi = 0, vl = vs.length; vi < vl; vi++) {
          prop = propPrefix + vs[vi];
          for (prefix in prefixes) output.push(prefix + prop);
          output.push(prop);
        }
        continue;
      }
      for (vi = 0, vl = vs.length; vi < vl; vi++) output.push(propPrefix + vs[vi]);
    }
    return output.join(';');
  };
  stringify.prefixedAttrs = prefixedAttrs;
  stringify.prefixes = prefixes;
  return stringify;
};
