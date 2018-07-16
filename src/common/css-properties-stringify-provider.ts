/**
 * @overview cssPropertiesStringifyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */


import {kebabCase, isArrayLikeObject} from "lodash";

export interface cssPropertiesStringify {
  (props: CssProps): string;
  prefixedAttrs?: flagsMap;
  prefixes?: flagsMap;
};


export interface CssProps {
  [n: string]: string | string[];
}


export const cssPropertiesStringifyProvider = (
  prefixedAttrs?: flagsMap, 
  prefixes?: flagsMap
) => {
  prefixedAttrs || (prefixedAttrs = {});
  prefixes || (prefixes = {});
  const stringify: cssPropertiesStringify = (props) => {
    let output = [], vs, vl, vi, prop, prefix, propPrefix, propertyName;
    for (propertyName in props) {
      propPrefix = (propertyName[0] === '-' ? '-' : '') + kebabCase(propertyName) + ':';
      if (!isArrayLikeObject(vs = props[propertyName])) vs = [ vs ];
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


