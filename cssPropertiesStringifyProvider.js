const camelToKebabCase = require('./camelToKebabCase');
const isArray = require('./isArray');
const isObject = require('./isObject');
const push = require('./push');

module.exports = (prefixedAttrs, prefixes) => {
  function stringify(props, important) {
    const suffix = important ? '!important': '';
    let output = [], vs, vl, vi, prop, prefix, propPrefix, propertyName, _prefixes; // eslint-disable-line
    for (propertyName in props) { // eslint-disable-line
      propPrefix = camelToKebabCase(propertyName) + ':';
      if (!isArray((vs = props[propertyName]))) vs = [vs];
      vi = 0;
      vl = vs.length;
      if (_prefixes = prefixedAttrs[propertyName]) {
        isObject(_prefixes) || (_prefixes = prefixes);
        for (;vi < vl; vi++) {
          prop = propPrefix + vs[vi] + suffix;
          for (prefix in _prefixes) push(output, prefix + prop); // eslint-disable-line
          push(output, prop);
        }
        continue;
      }
      // eslint-disable-next-line
      for (; vi < vl; vi++) push(output, propPrefix + vs[vi] + suffix);
    }
    return output.join(';');
  }
  stringify.prefixedAttrs = prefixedAttrs = prefixedAttrs || {};
  stringify.prefixes = prefixes = prefixes || {};
  return stringify;
};
