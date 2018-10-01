/**
 * @overview MinimalistNotation preset "default settings"
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const { flags } = mn.utils;
  flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
  flags([
    'transform',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'boxSizing'
  ], mn.propertiesStringify.prefixedAttrs);
};
