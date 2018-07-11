/**
 * @overview doneAll
 * Принимает массив асинхронные функции и
 * выполняет их, затем по завершении вызывает колбык
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * @example
 * 
 * doneAll([
 *   done => support('CSS.escape') ? done() : scriptLoad('assets/standalone-shims/css.escape.shim.js', done);
 * 	
 * ], () => {
 *   console.log('done!');
 * });
 * 
 */


import {thenable} from './thenable';

const execute = (cb, done) => {
	if (!cb) return done();
	try {
		cb(done);
	} catch (ex) {
		console.error(ex);
	}
};
export const doneAll = (callbacks, complete) => {
	return thenable((resolve) => {
		const length = callbacks.length;
		const _ex = () => {
			complete && complete();
			resolve();
		};
		if (length < 1) return _ex();
		let count = 0;
		const done = () => {
			if (++count < length) return;
			_ex();
		};
		for (let i = 0; i < length; i++) execute(callbacks[i], done);
	});
};