

interface fn {
	(...args: any[]): any
}

interface FlagsMap {
	[name: string]: boolean;
}

interface callEach {
	(funcs: fn[], args?: any[], context?: any): any;
}