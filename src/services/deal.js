/**
 * @overview Deal
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

const extend = require('../utils/extend');
const support = require('../utils/support');
const delay = require('../utils/delay');
const immediate = require('../utils/immediate');
const eachApply = require('../utils/each-apply');
const destroyProvider = require('../utils/destroy-provider');
const eachTry = require('../utils/each-try');
const isPromise = require('../utils/is-promise');
const isLength = require('../utils/is-length');
class Deal {
	constructor (executor) {
		const self = this;
		let poolResolve = [];
		let poolReject = [];
		let poolProgress = [];
		let done;
		let subject;
		let error;
		let innerCancel = self.cancel = cancelNoop;
		const clear = () => {
			poolResolve = [];
      poolReject = [];
			poolProgress = [];
		};
		const normalizeWrap = (onResolve, onReject) => {
			return (subject) => {
				return immediate(() => {
					if (!isPromise(subject)) return onResolve(subject);
					const next = subject.then(onResolve, onReject);
					const _cancel = next && next.cancel;
					if (_cancel) innerCancel = _cancel;
				});
			};
		};
		const resolve = (_subject) => {
			if (done) return;
			done = true;
			eachApply(poolResolve, [ subject = _subject ]);
			clear();
		};
		const reject = (_subject) => {
			if (done) return;
			done = error = true;
			eachApply(poolReject, [ subject = _subject ]);
			clear();
		};
		const progress = (_subject) => {
			if (done) return;
			eachTry(poolProgress, [ _subject ]);
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
	    return cancel;
		});

		const __chain = (onResolve, onReject) => {
			if (done) return (error ? onReject : onResolve)(subject);
			poolResolve.push(onResolve);
			poolReject.push(onReject);
		};

		const __then = self.then = (onResolve, onReject, onProgress) => {
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
		self.catch = (onReject, onProgress) => __then(null, onReject, onProgress);
		self.finally = (onFinally, onProgress) => {
			return __then(
				(subject) => {
					try {
						onFinally(null, subject);
					} catch (ex) {
						console.error(ex);
					}
					return subject;
				},
				(subject) => {
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

	static resolve(subject) {
		return new Deal((resolve) => resolve(subject));
	}
	static reject(subject) {
		return new Deal((resolve, reject) => reject(subject));
	}
	static all(deals) {
		return new Deal((resolve, reject, progressEmit) => {
			let stop;
			const aggregateDeals = [];
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

		      deal.progress && deal.progress((e) => {
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
		      	(subject) => stop || done(subject),
			      (subject) => {
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
	static race(deals) {
		return new Deal((resolve, reject, progressEmit) => {
			let stop;
			const aggregateDeals = [];
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
		      deal.progress && deal.progress(e => {
		        childs[key] = e;
		        const loaded = e.loaded, total = e.total;
		        const _k = loaded / total;
		        if (_k < loadedK) return;
		        loadedK = _k;
		        progressEmit({loaded, total, childs, key});
		      });
		      deal.then(
		      	(subject) => {
			        if (stop) return;
			        clear();
			       	resolve(subject);
			      },
			      (subject) => stop || done(subject)
		      );
				},
				output => stop || reject(output)
			);
			return clear;
		});
	}
	static delay(_delay) {
		return new Deal((resolve) => delay(resolve, _delay));
	}
}
module.exports = Deal;
const cancelNoop = () => false;
const subscribleInit = (init) => {
	let count = 0, cancel;
	return () => {
		let _count = count;
		count++;
		_count || (cancel = init());
		let called;
		return () => {
			if (called) return false;
			called = true;
			--count || cancel();
			return true;
		};
	};
};

((_Promise) => {
	if (!_Promise) return;
	const Prototype = function(){};
	Prototype.prototype = _Promise.prototype;
	// @ts-ignore
	Deal.prototype = extend(new Prototype(), Deal.prototype);
})(support('Promise'));


const subscribleProvider = (executor) => {
	let _subject, _error, _done;
	let __onResolve;
	let __onReject;
	const cancel = executor(
		(subject) => {
			if (_done) return;
			_done = true;
			_subject = subject;
			__onResolve && __onResolve(subject);
			__onResolve = __onReject = null;
		},
		(subject) => {
			if (_done) return;
			_error = _done = true;
			_subject = subject;
			__onReject && __onReject(subject);
			__onResolve = __onReject = null;
		}
	);
	return (onResolve, onReject) => {
		if (_done) {
			(_error ? onReject : onResolve)(_subject);
		} else {
			__onReject = onReject;
			__onResolve = onResolve;
		}
		return cancel;
	};
};


/*
interface reducer {
	(v: any, k: string | number, done: done): any
}
interface done {
	(v: any): any
}
interface progress {
	(v: progressEvent): any
}
interface progressEvent {
	loaded: number;
	total: number;
	childs?: {
		[key: string]: progressEvent
	}
}
*/

const reduceAsync = (src, reducer, done, dst, progress) => {
	let loaded = 0;
	done || (done = noop);
	progress || (progress = noop);
	const step = (k) => {
		let isDone;
		reducer(src[k], k, (v) => {
			if (isDone) return;
			isDone = true;
			dst[k] = v;
			progress({loaded, total});
			++loaded < total || done(dst);
		});
	};
  let total = src.length;
  if (isLength(total)) {
    dst || (dst = new Array(total));
    if (total < 1) return done(dst);
    for (let i = 0; i < total; i++) step(i);
    return;
  }
  dst || (dst = {});
  if ((total = Object.keys(src).length) < 1) return done(dst)
  for (let k in src) step(k);
};
const noop = (v) => v;
