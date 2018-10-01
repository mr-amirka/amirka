/**
 * @overview cssPropertiesStringifyProvider
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
/// <reference path="../global.d.ts"/>

declare namespace cssPropertiesStringifyProvider {
  export interface cssPropertiesStringify {
    (props: CssProps): string;
    prefixedAttrs?: FlagsMap;
    prefixes?: FlagsMap;
  }
  export interface CssProps {
    [n: string]: string | string[];
  }
  export interface cssPropertiesStringifyProvider {
    (prefixedAttrs?: FlagsMap, prefixes?: FlagsMap): cssPropertiesStringify;
  }
}

declare const cssPropertiesStringifyProvider: cssPropertiesStringifyProvider.cssPropertiesStringifyProvider;
export = cssPropertiesStringifyProvider;
