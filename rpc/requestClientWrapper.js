const defer = require('../defer');
const noop = require('../noop');
const merge = require('../merge');
const dealDelay = require('../CancelablePromise').delay;
const eachApply = require('../eachApply');
const map = require('../map');
const forEach = require('../forEach');
const rpcRemoteClientWrapper = require('./remoteClientWrapper');

const SEND_TIMEOUT = 5;

module.exports = (options) => {
  const request = options.request;
  return rpcRemoteClientWrapper(merge([options, {
    init: (instance) => {
      const url = instance.url;
      const onmessage = instance.onmessage || noop;
      let promise;
      let defers = [];
      let hasSending;

      function terminate() {
        if (!defers) return;
        promise.cancel();
        instance = promise = url = defers = 0;
      }

      defer(instance.onopen || noop);

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
            responseMessages && forEach(responseMessages, onmessage);
            const waitings = map(defers, 1);
            (instance && instance.onclose || noop)(!!err);
            terminate();
            eachApply(finallys, [err]);
            eachApply(waitings, ['timeout']);
          });
        },
        close: terminate,
      };
    },
  }]));
};
