/**
 * @overview Deal
 * 
 * @author Absolutely Amir <mr.amirka@ya.ru>
 * 
 */

import { timeout } from './timeout'
import { immediate } from './immediate';
import { executeEach } from './execute-each';
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
	(resolve: onSubject, reject?: onSubject, progress?: onSubject): fn | void;
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
	constructor (executor?: executor) {
		const self = this;
		let poolResolve: onSubject[] = [];
		let poolReject: onSubject[] = [];
		let poolFinally: onFinally[] = [];
		let poolProgress: onSubject[] = [];
		let done: boolean;
		let subject: any;
		let error: any;
		const resolve = (_subject?: any) => {
			if (done) return;
			done = true;
			executeEach(poolResolve, [ subject = _subject ]);
			tryEach(poolFinally, [ null, _subject ]);
			poolFinally = poolProgress = poolReject = poolResolve = null;
		};
		const reject = (_subject?: any) => {
			if (done) return;
			done = error = true;
			executeEach(poolReject, [ subject = _subject ]);
			tryEach(poolFinally, [ _subject ]);
			poolFinally = poolProgress = poolReject = poolResolve = null;
		};
		const progress = (_subject?: any) => {
			if (done) return;
			tryEach(poolProgress, [ _subject ]);
		};
		const init = subscribleInit(() => {
	    let canceled = false;
	    let cancel = done ? cancelNoop : immediate(() => {
	    	if (canceled) return;
	    	try {
					if (executor) {
						const _cancel = executor(
							normalizeWrap(resolve, reject),
							normalizeWrap(reject, reject),
							progress
						);
						if (typeof _cancel === 'function') cancel = _cancel;
					} else {
						resolve();
					}
				} catch (ex) {
					reject(ex);
				}
	    });
	    return () => {
	      if (canceled) return;
	      canceled = true;
	      poolResolve = [];
	      poolReject = [];
				poolProgress = [];
	      cancel();
	    };
		});

		const __chain = (onResolve: onSubject, onReject: onSubject) => {
			if (done) return (error ? onReject : onResolve)(subject);
			poolResolve.push(onResolve);
			poolReject.push(onReject);
		};
		
		const __deal = (onResolve: onSubject, onReject: onSubject) => {
			const cancel = init();
	    const deal = new Deal((_resolve, _reject) => {
	    	__chain(
	    		onResolve ? subject => {
	    			try {
	  					_resolve(onResolve(subject));
	  				} catch (ex) {
	  					_reject(ex);
	  				}
	    		} : _resolve,
	    		onReject ? error => {
	    			try {
	  					_resolve(onReject(error));
	  				} catch (ex) {
	  					_reject(ex);
	  				}
	    		} : _reject
	    	);
				return cancel;
			});
	    deal.cancel = cancel;
	    return deal;
	  };

	  self.cancel = cancelNoop;
		const __then = self.then = (onResolve: onSubject, onReject: onSubject, onProgress: onSubject) => {
	    done || onProgress && poolProgress.push(onProgress);
    	return __deal(onResolve, onReject);
	  };
		self.catch = (onReject, onProgress) => __then(null, onReject, onProgress);
		self.finally = (onFinally: onFinally, onProgress?: onSubject) => {
			if (done) {
				try {
					error ? onFinally(subject) : onFinally(null, subject);
				} catch (ex) {
					console.error(ex);
				}
				return self;
			}
			poolFinally.push(onFinally);
			onProgress && poolProgress.push(onProgress);
			return self;
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

	static timeout(delay?: number) {
		return new Deal((resolve) => timeout(resolve, delay));
	}
}

const normalizeWrap = (onResolve: onSubject, onReject: onSubject) => {
	return (subject: any) => isPromise(subject)
		? subject.then(onResolve, onReject) 
		: onResolve(subject);
};
const cancelNoop = () => false;
