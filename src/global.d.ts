interface fn {
	(...args: any[]): any
}

interface flagsMap {
	[name: string]: boolean;
}

interface callEach {
	(funcs: fn[], args?: any[], context?: any): any;
}