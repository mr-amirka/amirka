const camelToKebabCase = require('./camelToKebabCase');
const isArray = require('./isArray');
const push = require('./push');

module.exports = (prefixedAttrs, prefixes) => {
  function stringify(props, important) {
    const suffix = important ? '!important': '';
    let output = [], vs, vl, vi, prop, prefix, propPrefix, propertyName; // eslint-disable-line
    for (propertyName in props) { // eslint-disable-line
      propPrefix = camelToKebabCase(propertyName) + ':';
      if (!isArray((vs = props[propertyName]))) vs = [vs];
      if (prefixedAttrs[propertyName]) {
        for (vi = 0, vl = vs.length; vi < vl; vi++) {
          prop = propPrefix + vs[vi] + suffix;
          for (prefix in prefixes) push(output, prefix + prop); // eslint-disable-line
          push(output, prop);
        }
        continue;
      }
      // eslint-disable-next-line
      for (vi = 0, vl = vs.length; vi < vl; vi++) push(output, propPrefix + vs[vi] + suffix);
    }
    return output.join(';');
  }
  stringify.prefixedAttrs = prefixedAttrs = prefixedAttrs || {};
  stringify.prefixes = prefixes = prefixes || {};
  return stringify;
};
