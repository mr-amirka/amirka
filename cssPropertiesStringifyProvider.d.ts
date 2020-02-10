/**
 * @overview cssPropertiesStringifyProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
 
import { FlagsMap }  from "./global";

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
