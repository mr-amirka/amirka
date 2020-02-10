const defer = require('../defer');
const noop = require('../noop');
const dealDelay = require('../CancelablePromise').delay;
const eachApply = require('../eachApply');
const map = require('../map');
const forEach = require('../forEach');
const rpcRemoteClientWrapper = require('./remoteClientWrapper');

const SEND_TIMEOUT = 5;

module.exports = (url, env, reconnectTimeout, request) => {
  return rpcRemoteClientWrapper(({url, onopen, onmessage, onclose}) => {
    let promise;
    let defers = [];
    let hasSending;

    function terminate() {
      if (!defers) return;
      promise.cancel();
      promise = onmessage = onclose = onopen = url = defers = 0;
    }

    onopen && defer(onopen);

    return {
      send: (message, onFinally) => {
        if (!defers) return;
        defers.push([message, onFinally || noop]);
        if (hasSending) return;
        hasSending = 1;
        const finallys = [];
        promise = dealDelay(SEND_TIMEOUT).then(() => {
          const sendingMessages = defers.map((ctx) => {
            finallys.push(ctx[1]);
            return ctx[0];
          });
          defers = [];
          return request(url, sendingMessages);
        }).finally((err, responseMessages) => {
          responseMessages && onmessage && forEach(responseMessages, onmessage);
          const waitings = map(defers, 1);
          onclose && onclose(!!err);
          terminate();
          eachApply(finallys, [err]);
          eachApply(waitings, ['timeout']);
        });
      },
      close: terminate,
    };
  }, url, env, reconnectTimeout);
};
