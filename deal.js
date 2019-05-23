/**
 * @overview Deal
 * @author Amir Absolutely <mr.amirka@ya.ru>
 *
 */

const extend = require('./extend');
const support = require('./support');
const delay = require('./delay');
const __deferApply = require('./defer');
const eachApply = require('./eachApply');
const executeTry = require('./executeTry');
const destroyProvider = require('./destroyProvider');
const eachTry = require('./eachTry');
const isPromise = require('./isPromise');
const isLength = require('./isLength');

const { getter } = require('./get');

class Deal {
	constructor (executor, deferApply) {
    deferApply || (deferApply = __deferApply);
		const self = this;
		let poolResolve = [];
    let poolReject = [];
		let done;
		let subject;
		let error;
		let innerCancel = self.cancel = cancelNoop;
		const clear = () => {
      poolResolve = [];
      poolReject = [];
		};
		const normalizeWrap = (onResolve, onReject) => {
			return (subject) => {
				return deferApply(() => {
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

		const _resolve = self.resolve = normalizeWrap(resolve, reject);
		const _reject = self.reject = normalizeWrap(reject, reject);
		const init = subscribleInit(() => {
	    let __cancel = !done && executor ? deferApply(() => {
	    	try {
					const _cancel = executor(_resolve, _reject);
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

		const __then = self.then = (onResolve, onReject, onCancel) => {
      onResolve = getter(onResolve);
      onReject = getter(onReject);

      const cancel = destroyProvider();
      if (!done) {
        cancel.add(init());
        onCancel && cancel.add(() => {
          done || onCancel();
        });
      }
    	const deal = new Deal(subscribleProvider((__resolve, __reject) => {
        const __clear = cancel.clear;
    		cancel.add(deferApply(() => {
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
			}), deferApply);
			deal.cancel = cancel;
			return deal;
	 	};
		self.catch = (onReject, onCancel) => __then(null, onReject, onCancel);
		self.finally = (onFinally) => {
			return __then(
				(subject) => {
          executeTry(onFinally, [ null, subject ]);
					return subject;
				},
				(subject) => {
          executeTry(onFinally, [ subject ]);
					throw subject;
				},
        () => {
          executeTry(onFinally);
				}
			);
	  };
    self.watchCancel = (onCancel) => __then(null, null, null, onCancel);;
	}

	static resolve(subject, deferApply) {
		return new Deal((resolve) => resolve(subject), deferApply);
	}
	static reject(subject, deferApply) {
		return new Deal((resolve, reject) => reject(subject), deferApply);
	}
	static all(deals, deferApply) {
		return new Deal((resolve, reject) => {
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
		}, deferApply);
	}
	static race(deals, deferApply) {
		return new Deal((resolve, reject) => {
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
		}, deferApply);
	}
	static delay(_delay, subject, deferApply) {
		return new Deal((resolve) => delay(resolve, _delay, [ subject ]), deferApply);
	}
  static deal(executor, deferApply) {
    return new Deal(executor, deferApply);
  }
  static defer(fn, deferApply) {
    return new Deal((resolve) => {
      resolve(fn && fn());
    }, deferApply);
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



const reduceAsync = (src, reducer, done, dst) => {
	let loaded = 0;
	done || (done = noop);
	const step = (k) => {
		let isDone;
		reducer(src[k], k, (v) => {
			if (isDone) return;
			isDone = true;
			dst[k] = v;
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
