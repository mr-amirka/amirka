
export interface IFlagsMap {
  [name: string]: number;
}

  /**
   * @description
   * any function
   */
export type fn = (...args: any[]) => any;

  /**
   * @description
   * The function, the call of which canceled the subscription to an event or execute destructor
   */
export type cancel = fn;

  /**
   * @description
   * It execute functions array
   */
export type eachApply = (funcs: fn[] | {[key: string]: fn}, args?: any[], context?: any) => any;

  /**
   * @description
   * Performs defer function execution
   */
export type defer = (callback: fn) => cancel;

export interface IUrlOptions {
  href?: string;
  search?: string;
  unhash?: string;
  hash?: string;
  query?: any;
  protocol?: string;
  path?: string;
  hostname?: string;
  host?: string;
  port?: string;
  unalias?: string;
  dirname?: string;
  filename?: string;
  alias?: string;
  unextension?: string;
  extension?: string;
  unsearch?: string;
  userpart?: string;
  username?: string;
  password?: string;
  email?: string;
  child?: IUrlOptions;
}

export interface ICssPropertiesStringify {
  (props: ICssProps): string;
  prefixedAttrs?: IFlagsMap;
  prefixes?: IFlagsMap;
}
export interface ICssProps {
  [propName: string]: string | string[];
}
