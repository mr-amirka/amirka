
interface IFlagsMap {
  [name: string]: boolean;
}

  /**
   * @description
   * any function
   */
type fn = (...args: any[]) => any;

  /**
   * @description
   * The function, the call of which canceled the subscription to an event or execute destructor
   */
type cancel = fn;

  /**
   * @description
   * It execute functions array
   */
type eachApply = (funcs: fn[] | {[key: string]: fn}, args?: any[], context?: any) => any;

  /**
   * @description
   * Performs defer function execution
   */
type defer = (callback: fn) => cancel;

export {
  IFlagsMap,
  fn,
  cancel,
  eachApply,
  defer,
};
