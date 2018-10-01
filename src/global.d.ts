
interface fn {
	(...args: any[]): any
}

interface FlagsMap {
	[name: string]: boolean;
}

interface eachApply {
	(funcs: fn[], args?: any[], context?: any): any;
}