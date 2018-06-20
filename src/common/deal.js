/**
 * @overview Deal
 * @author Absalyamov Amir <mr.amirka@ya.ru>
 */

import {
	isArrayLikeObject
} from 'lodash';

import {execute} from '../base/execute';

const cancelNoop = () => false;
const initProvider = (init) => {
	let count = 0, cancel;
	return () => {
		let _count = count;
		count++;
		_count || (cancel = init());
		let hasCalled;
		return () => {
			if (hasCalled) return false;
			hasCalled = true;
			--count || cancel();
			return true;
		};
	};
};


export function Deal(executor) {
	const self = this;
	let onProgressPool = [];
	let promise;

	self.cancel = cancelNoop;

  const __normalize = subject => subject instanceof Deal ? subject.$$promise : subject;
	const init = initProvider(() => {
    let hasCanceled = false;
    let cancel;
		promise = self.$$promise = (new Promise((resolve, reject) => {
			if (hasCanceled) return;
			let _cancel = executor((subject) => {
				hasCanceled = true;
				resolve(subject);
			}, (subject) => {
				hasCanceled = true;
				reject(subject);
			}, (subject) => execute(onProgressPool, [ subject ], self));

      cancel = self.cancel = typeof _cancel === 'function' ? _cancel : cancelNoop;
		})).then(__normalize);
    return () => {
      if (hasCanceled) return;
      hasCanceled = true;
      onProgressPool = [];
      cancel();
    };
	});

  const __deal = (onResolve, onReject, onProgress) => {
    const cancel = init();
    const _promise = promise
      .then(onResolve, onReject)
      .then(__normalize);
    onProgress && onProgressPool.push(onProgress);
    const deal = new Deal((resolve, reject, progress) => {
      onProgressPool.push(progress);
      _promise.then(resolve, reject);
      return cancel;
    });
    deal.cancel = cancel;
    return deal;
  };

	const __then = self.then = (onResolve, onReject, onFinally, onProgress) => {
		let deal = __deal(onResolve, onReject, onProgress);
    if (onFinally) deal = deal.finally(onFinally);    
		return deal;
	};
	self.catch = (onReject, onFinally, onProgress) => __then(null, onReject, onFinally, onProgress);
	self.finally = (onFinally, onProgress) => {
    return __deal((subject) => {
      onFinally(null, subject);
      return subject;
    }, (err) => {
      onFinally(err);
      return Promise.reject(err);
    }, onProgress);
  };
	self.progress = (...args) => {
		onProgressPool.push(...args);
		return self;
	};

};

Deal.prototype = Object.create(Promise.prototype);

Deal.resolve = (subject) => new Deal((resolve) => resolve(subject));
Deal.reject = (subject) => new Deal((resolve, reject) => reject(subject));
Deal.all = (deals) => {
  const hasArray = isArrayLikeObject(deals);
  return new Deal((resolve, reject, progressEmit) => {
    const keys = hasArray ? null : Object.keys(deals);
    const l = isArray ? deals.length : keys.length;
    if (l < 1) return resolve(hasArray ? [] : {});
    let c = 0;
    const output = hasArray ? [] : {};
    const check = () => ++c < l || resolve(output);
    let stop = false;
    const aggregateDeals = [];
    const progressEvents = {};
   	const ondeal = (i, deal) => {
      aggregateDeals.push(deal);
      deal.progress && deal.progress((e) => {
        progressEvents[i] = e;
        let loaded = 0, total = 0, k, v;
        for(k in progressEvents){
            v = progressEvents[k];
            loaded += v.loaded || 0;
            total += v.total || 0;
        }
        progressEmit({loaded, total, progressEvents});
      });
      deal.then((subject) => {
        if (stop) return;
        output[i] = subject;
        check();
      }, (subject) => {
       	if (stop) return;
       	clear();
       	reject(subject);
      });

    };
    const step = i => {
      const deal = deals[i];
      if (deal instanceof Promise) return ondeal(i, deal);
      output[i] = deal;
      check();
    };
    const clear = () => {
      stop = true;
      aggregateDeals.forEach(deal => {
        const cancel = deal.cancel;
        cancel && cancel.call(deal);
      });
    };
    let i = 0;
    if(hasArray){
      for(; i < l; i++) step(i);
      return clear;
    }
    for(; i < l; i++) step(keys[i]);
    return clear;
  });

};

Deal.race = (deals) => {
	const hasArray = isArrayLikeObject(deals);
  return new Deal((resolve, reject, progressEmit) => {
  	const keys = hasArray ? null : Object.keys(deals);
    const l = isArray ? deals.length : keys.length;
    if (l < 1) return reject(hasArray ? [] : {});
	  let c = 0;
	  const output = [];
	  let stop = false;
	  const progressEvents = {};
	  let loadedK = 0;
	  const step = i => {
      const deal = deals[i];
      if (!(deal instanceof Promise)) {
      	deals[i] = null;
        clear();
        resolve(deal);
        return;
      }
	    deal.progress && deal.progress((e) => {
        progressEvents[i] = e;
        const loaded = e.loaded, total = e.total;
        const _k = loaded / total;
        if(_k < loadedK)return;
        loadedK = _k;
        progressEmit({loaded, total, progressEvents, i});
			});
      deal.then((subject) => {
        if (stop) return;
        deals[i] = null;
        clear();
        resolve(subject);
      }, (subject) => {
        if (stop) return;
        output[i] = subject;
        ++c < l || reject(output);
      });
	  };
	  const clear = () => {
	    stop = true;
	    for(let i = 0, deal, cancel; i < l; i++){
	    	(deal = deals[i]) && (cancel = deal.cancel) && cancel.call(deal);
	    }
	  };

	  let i = 0;
    if(hasArray){
      for(; i < l; i++) {
      	step(i);
      	if (stop) return clear;
      }
      return clear;
    }
    for(; i < l; i++) {
    	step(keys[i]);
    	if (stop) return clear;
    }
	  return clear;
	});
};