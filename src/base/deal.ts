/**
 * @overview Deal
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import { extend } from 'lodash';
import { support } from './support'
import { timeout } from './timeout'
import { immediate } from './immediate';
import { executeEach } from './execute-each';
import { destroyProvider } from './destroy-provider';
import { tryEach } from './try-each';
import { subscribleInit } from './subscrible-init';
import { isPromise } from './is-promise';
import { reduceAsync } from './reduce-async';


interface onSubject {
	(subject?: any): any;
}
interface onFinally {
	(error?: any, subject?: any): any;
}
interface executor {
	(resolve: onSubject, reject: onSubject, progress: onSubject): fn | void;
}
interface _then {
	(onResolve: onSubject, onReject?: onSubject, onProgress?: onSubject): Deal;
}
interface _catch {
	(onReject: onSubject, onProgress?: onSubject): Deal;
}
interface _finally {
	(onFinally: onFinally, onProgress?: onSubject): Deal;
}
interface _progress {
	(onProgress: onSubject): Deal;
}


export class Deal {
	cancel: fn;
	then: _then;
	catch: _catch;
	finally: _finally;
	progress: _progress;

	resolve: (subject?: any) => fn;
	reject: (subject?: any) => fn;

	constructor (executor?: executor) {
		//super();
		const self = this;
		let poolResolve: onSubject[] = [];
		let poolReject: onSubject[] = [];
		let poolProgress: onSubject[] = [];
		let done: boolean;
		let subject: any;
		let error: any;
		let innerCancel: fn = self.cancel = cancelNoop;
		const clear = () => {
			poolResolve = [];
      		poolReject = [];
			poolProgress = [];
		};
		const normalizeWrap = (onResolve: onSubject, onReject: onSubject) => {
			return (subject?: any) => {
				return immediate(() => {
					if (!isPromise(subject)) return onResolve(subject);
					const next = subject.then(onResolve, onReject);
					const _cancel = next && next.cancel;
					if (_cancel) innerCancel = _cancel;
				});
			};
		};
		const resolve = (_subject?: any) => {
			if (done) return;
			done = true;
			executeEach(poolResolve, [ subject = _subject ]);
			clear();
		};
		const reject = (_subject?: any) => {
			if (done) return;
			done = error = true;
			executeEach(poolReject, [ subject = _subject ]);
			clear();
		};
		const progress = (_subject?: any) => {
			if (done) return;
			tryEach(poolProgress, [ _subject ]);
		};

		const _resolve = self.resolve = normalizeWrap(resolve, reject);
		const _reject = self.reject = normalizeWrap(reject, reject);
		const init = subscribleInit(() => {
	    let __cancel = !done && executor ? immediate(() => {
	    	try {
					const _cancel = executor(_resolve, _reject, progress);
					if (typeof _cancel === 'function') __cancel = _cancel;
				} catch (ex) {
					_reject(ex);
				}
	    }) : cancelNoop;
	    const cancel = () => {
	      innerCancel();
	      __cancel();
	      clear();
	    };
	    //self.cancel = once(cancel);
	    return cancel;
		});

		const __chain = (onResolve: onSubject, onReject: onSubject) => {
			if (done) return (error ? onReject : onResolve)(subject);
			poolResolve.push(onResolve);
			poolReject.push(onReject);
		};
		
		const __then = self.then = (onResolve?: onSubject, onReject?: onSubject, onProgress?: onSubject) => {
	    done || onProgress && poolProgress.push(onProgress);
	    const cancel = destroyProvider(init());
    	const deal = new Deal(subscribleProvider((__resolve, __reject) => {
    		cancel.add(immediate(() => {
					__chain(
		    		onResolve ? subject => {
		    			try {
		  					__resolve(onResolve(subject));
		  				} catch (ex) {
		  					__reject(ex);
		  				}
		    		} : __resolve,
		    		// @ts-ignore
		    		onReject ? error => {
		    			try {
		  					__resolve(onReject(error));
		  				} catch (ex) {
		  					__reject(ex);
		  				}
		    		} : __reject
		    	);
				}));
				return cancel;
			}));
			deal.cancel = cancel;
			return deal;
	  };
		self.catch = (onReject, onProgress) => __then(<any> null, onReject, onProgress);
		self.finally = (onFinally: onFinally, onProgress?: onSubject) => {
			return __then(
				(subject: any) => {
					try {
						onFinally(null, subject);
					} catch (ex) {
						console.error(ex);
					}
					return subject;
				},
				(subject: any) => {
					try {
						onFinally(subject);
					} catch (ex) {
						console.error(ex);
					}
					throw subject;
				},
				onProgress
			);
	  };
		self.progress = (onProgress) => {
			done || poolProgress.push(onProgress);
			return self;
		};
		return self;
	}

	static resolve(subject?: any) {
		return new Deal((resolve) => resolve(subject));
	}
	static reject(subject?: any) {
		return new Deal((resolve, reject) => reject(subject));
	}
	static all(deals: any[]) {
		return new Deal((resolve, reject, progressEmit) => {
			let stop: boolean;
			const aggregateDeals: any[] = [];
	    const childs = {};
	    const clear = () => {
	      stop = true;
	      aggregateDeals.forEach(deal => deal.cancel && deal.cancel());
	    };
			reduceAsync(
				deals,
				(deal, key, done) => {
					if (stop) return;
					if (!isPromise(deal)) return done(deal);
					aggregateDeals.push(deal);

		      deal.progress && deal.progress((e: any) => {
		        childs[key] = e;
		        let loaded = 0, total = 0, k, v;
		        for (k in childs) {
	            v = childs[k];
	            loaded += v.loaded || 0;
	            total += v.total || 0;
		        }
		        progressEmit({loaded, total, childs});
		      });
		      deal.then(
		      	(subject: any) => stop || done(subject),
			      (subject: any) => {
			       	if (stop) return;
			       	clear();
			       	reject(subject);
			      }
		      );
				},
				output => stop || resolve(output)
			);
			return clear;
		});
	}
	static race(deals: any[]) {
		return new Deal((resolve, reject, progressEmit) => {
			let stop: boolean;
			const aggregateDeals: any[] = [];
	    const childs = {};
	    let loadedK = 0;
	    const clear = () => {
	      stop = true;
	      aggregateDeals.forEach(deal => deal.cancel && deal.cancel());
	    };
			reduceAsync(
				deals, 
				(deal, key, done) => {
					if (stop) return;
					if (!isPromise(deal)) return done(deal);
					aggregateDeals.push(deal);
		      deal.progress && deal.progress((e: any) => {
		        childs[key] = e;
		        const loaded = e.loaded, total = e.total;
		        const _k = loaded / total;
		        if (_k < loadedK) return;
		        loadedK = _k;
		        progressEmit({loaded, total, childs, key});
		      });
		      deal.then(
		      	(subject: any) => {
			        if (stop) return;
			        clear();
			       	resolve(subject);
			      },
			      (subject: any) => stop || done(subject)
		      );
				},
				output => stop || reject(output)
			);
			return clear;
		});
	}

	/**
	 * @description Deal.doneAll
	 * Принимает массив асинхронные функции и
	 * выполняет их, затем по завершении вызывает колбэк
	 *
	 * @example
	 * 
	 * Deal.doneAll([
	 *   done => support('CSS.escape') ? done() : scriptLoad('assets/standalone-shims/css.escape.shim.js', done);
	 * 	
	 * ]).finally(() => {
	 *   console.log('done!');
	 * });
	 * 
	 */
	 /*
	static doneAll(funcs: fn[]) {
		return new Deal((resolve, reject, progress) => {
			let hasError: boolean;
			reduceAsync(
				funcs,
				(fn, key, done) => {
					try {
						fn(() => done(null));
					} catch (ex) {
						hasError = true;
						done(ex);
					}
				},
				(errors) => hasError ? reject(errors) : resolve(),
				null,
				progress
			);
		});
	}
	*/

	static timeout(delay?: number) {
		return new Deal((resolve) => timeout(resolve, delay));
	}
}

const cancelNoop = () => false;

const subscribleProvider = (executor: fn) => {
	let _subject: any, _error: boolean, _done: boolean;
	let __onResolve: fn | null;
	let __onReject: fn | null;
	const cancel = executor(
		(subject: any) => {
			if (_done) return;
			_done = true;
			_subject = subject;
			__onResolve && __onResolve(subject);
			__onResolve = __onReject = null;
		}, 
		(subject: any) => {
			if (_done) return;
			_error = _done = true;
			_subject = subject;
			__onReject && __onReject(subject);
			__onResolve = __onReject = null;
		}
	);
	return (onResolve: onSubject, onReject: onSubject) => {
		if (_done) {
			(_error ? onReject : onResolve)(_subject);
		} else {
			__onReject = onReject;
			__onResolve = onResolve;
		}
		return cancel;
	};
};



((_Promise) => {
	if (!_Promise) return;
	const Prototype = function(){};
	Prototype.prototype = _Promise.prototype;
	// @ts-ignore
	Deal.prototype = extend(new Prototype(), Deal.prototype);
})(support('Promise'));