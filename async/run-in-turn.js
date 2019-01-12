/*

runInTurn((create) => {
  const first = create();
  const second = create();

  second(() => {
    console.log(1);
  });

  first(() => {
    console.log(2);
  });

  first(() => {
    console.log(3);
  });

});

*/

const noop = require('../noop');
const Deal = require('../deal');
const immediate = require('../immediate');
const loopAsync = require('./loop');

const dealDefer = Deal.defer;


const turnProvider = exports.turnProvider = () => {
  let current, last = {}, canceled;
  let currentPromise;
  const isRunning = () => !!current;

  return {
    wait: (promise) => {
      currentPromise = currentPromise ? currentPromise.then(() => {
        return promise;
      }) : promise;
    },
    start: (__immediate) => {
      return loopAsync(isRunning, () => {
        const fn = current.fn;
        current = current.next;
        fn && fn();
        if (currentPromise) {
          const promise = currentPromise;
          currentPromise = null;

          return promise;
        }
      }, __immediate).watchCancel(() => {
        canceled = true;
        current = null;
      });
    },
    isRunning,
    defer: (fn, args, ctx) => {
      fn = fnWrap(fn, args, ctx);
      if (canceled) {
        fn();
        return noop;
      }
      const prev = last;
      last = prev.next = { fn };
      if (!current) current = last;
      return subscriptionWrap(last);
    }
  };
};

const fnWrap = (fn, args, ctx) => {
  return () => fn.apply(ctx || null, args || []);
};

exports.runInTurn = (fn, __immediate) => {
  const __turn = turnProvider();
  const parentWait = __turn.wait;
  const parentDefer = __turn.defer;
  let canceled, result;
  __turn.defer(() => {
    return result = fn(() => {
      const turn = turnProvider();
      const defer = turn.defer;
      const start = turn.start;
      let hasRunning;

      const init = () => {
        hasRunning = true;
        parentDefer(() => {
          parentWait(start(__immediate).finally(() => {
            hasRunning = false;
          }));
        });
      };
      init();

      return (fn, args, ctx) => {
        fn = fnWrap(fn, args, ctx);
        if (canceled) {
          fn();
          return noop;
        }
        hasRunning || init();
        return defer(fn);
      };
   });
 });

  return __turn.start(__immediate).then(() => {
    return result;
  }).finally(() => {
    canceled = true;
  });
};


const subscriptionWrap = (current) => {
  return () => {
    if (current) {
      delete current.fn;
      current = null;
    }
  }
};
