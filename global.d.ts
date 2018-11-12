
interface fn {
	(...args: any[]): any
}

interface FlagsMap {
	[name: string]: boolean;
}

interface eachApply {
	(funcs: fn[] | {[key: string]: fn}, args?: any[], context?: any): any;
}

export {
  fn,
  FlagsMap,
  eachApply
}
