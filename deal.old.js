/**
 * @overview Deal
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 */

const extend = require('./extend');
const support = require('./support');
const delay = require('./delay');

//const __immediate = require('./immediate');
const __immediate = require('./defer');

const eachApply = require('./each-apply');
const executeTry = require('./execute-try');
const destroyProvider = require('./destroy-provider');
const eachTry = require('./each-try');
const isPromise = require('./is-promise');
const isLength = require('./is-length');

const { getter } = require('./get');

class Deal {
	constructor (executor, immediate) {
    immediate || (immediate = __immediate);
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
					const next = subject.then(onResolve, onReject, progress);
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

		const __then = self.then = (onResolve, onReject, onProgress, onCancel) => {
      onResolve = getter(onResolve);
      onReject = getter(onReject);

      const cancel = destroyProvider();
      if (!done) {
        onProgress && poolProgress.push(onProgress);
        cancel.add(init());
        onCancel && cancel.add(() => {
          done || onCancel();
        });
      }
    	const deal = new Deal(subscribleProvider((__resolve, __reject) => {
        const __clear = cancel.clear;
    		cancel.add(immediate(() => {
					__chain(
		    		onResolve ? subject => {
              __clear();
		    			try {
		  					__resolve(onResolve(subject));
		  				} catch (ex) {
		  					__reject(ex);
		  				}
		    		} : __resolve,
		    		onReject ? error => {
              __clear();
		    			try {
		  					__resolve(onReject(error));
		  				} catch (ex) {
		  					__reject(ex);
		  				}
		    		} : __reject
		    	);
				}));
				return cancel;
			}), immediate);
			deal.cancel = cancel;
			return deal;
	 	};
		self.catch = (onReject, onCancel) => __then(null, onReject, null, onCancel);
		self.finally = (onFinally, onProgress) => {
			return __then(
				(subject) => {
          executeTry(onFinally, [ null, subject ]);
					return subject;
				},
				(subject) => {
          executeTry(onFinally, [ subject ]);
					throw subject;
				},
				onProgress,
        () => {
          executeTry(onFinally);
				}
			);
	  };
		self.watchProgress = (onProgress) => {
			done || poolProgress.push(onProgress);
			return self;
		};
    self.watchCancel = (onCancel) => __then(null, null, null, onCancel);;
	}

	static resolve(subject, immediate) {
		return new Deal((resolve) => resolve(subject), immediate);
	}
	static reject(subject, immediate) {
		return new Deal((resolve, reject) => reject(subject), immediate);
	}
	static all(deals, immediate) {
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
		}, immediate);
	}
	static race(deals, immediate) {
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
		}, immediate);
	}
	static delay(_delay, subject, immediate) {
		return new Deal((resolve) => delay(resolve, _delay, [ subject ]), immediate);
	}
  static deal(executor, immediate) {
    return new Deal(executor, immediate);
  }
  static defer(fn, immediate) {
    return new Deal((resolve) => {
      resolve(fn && fn());
    }, immediate);
  }
}
module.exports = Deal;
const cancelNoop = () => false;
const subscribleInit = (init) => {
	let count = 0, cancel;
	return () => {
		let _count = count;
		count++;
		_count < 1 && (cancel = init());
		return () => {
			if (count < 1) return false;
      if (--count < 1) {
        cancel();
        cancel = null;
      }
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
