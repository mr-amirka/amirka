const noop = require('mn-utils/noop');
const delay = require('mn-utils/delay');

const PREV = 0;
const FN = 1;
const NEXT = 2;

module.exports = (__timeInterval) => {
  __timeInterval || (__timeInterval = 0);
  let __hasPlaying;
  let __cancel = noop;

  let elementInitial = [null, noop, null];
  let elementFirst = elementInitial;
  let elementLast = elementInitial;

  let lastTime;

  const nextApply = () => {
    const date = new Date();
    const time = date.getTime();
    let interval = time - lastTime;
    lastTime = time;
    let elementNext = elementFirst;
    while (elementNext) {
      const fn = elementNext[FN];
      elementNext = elementNext[NEXT];
      try {
        fn(date, interval);
      } catch (ex) {
        console.log(ex);
      }
    }
    __cancel = delay(nextApply, __timeInterval);
  };
  return {
    isPlaying() {
      return __hasPlaying;
    },
    pause() {
      __hasPlaying = false;
      __cancel();
    },
    play() {
      lastTime = getTime();
      if (__hasPlaying) return;
      __hasPlaying = true;
      nextApply();
    },
    unshiftAction(fn) {
      const next = elementFirst;
      return subscriptionWrap(elementFirst = next[PREV] = [ null, fn, next ], (_elementFirst) => {
        elementFirst = _elementFirst;
      });
    },
    pushAction(fn) {
      const prev = elementLast;
      return subscriptionWrap(elementLast = prev[NEXT]  = [ prev, fn, null ], null, (_elementLast) => {
        elementLast = _elementLast;
      });
    },
    setInterval(timeInterval) {
      __imeInterval = timeInterval || 0;
    },
    getInterval() {
      return __timeInterval;
    },
  }
};


const getTime = () => (new Date()).getTime();

const subscriptionWrap = (elementFollow, prevFn, nextFn) => {
  return () => {
    if (elementFollow) {
      const prev = elementFollow[PREV];
      const next = elementFollow[NEXT];
      if (prev) {
        prev[NEXT] = next;
      } else {
        prevFn && prevFn(next);
      }
      if (next) {
        next[PREV] = prev;
      } else {
        nextFn && nextFn(prev);
      }
      elementFollow = prevFn = nextFn = null;
    }
  }
};
