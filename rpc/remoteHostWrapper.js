const WebSocketServer = new require('ws'); // eslint-disable-line
const sha512 = require('../sha512');
const noop = require('../noop');
const CancelablePromise = require('../CancelablePromise');
const forEach = require('../forEach');
const uniqIdProvider = require('../uniqIdProvider');
const cacheProvider = require('../cacheProvider');
const {rpcProvider} = require('./rpcWrapper');

const WS_EVENT_CONNECT = 0;
const WS_EVENT_MESSAGE = 1;

module.exports = (options) => {
  const sessionsCache = options.sessionsCache || cacheProvider(3600000 * 24);
  const getSession = sessionsCache.get;
  const setSession = sessionsCache.set;
  const getClientId = uniqIdProvider();

  function getClient(sessionId) {
    let rpcClient = sessionId && getSession(sessionId);
    if (rpcClient) return rpcClient;
    setSession(
        sessionId = sha512('' + getClientId() + '|' + (new Date()).getTime()),
        rpcClient = {
          sessionId,
          defers: [
            [[WS_EVENT_CONNECT, sessionId], noop],
          ],
        },
        () => {
          rpc && rpc.destroy();
        },
    );
    const rpc = rpcProvider(
        0,
        options.init,
        (data) => {
          const promise = new CancelablePromise();
          rpcClient.onmessage([[WS_EVENT_MESSAGE, data], promise.resolve]);
          return promise;
        },
        (emit) => {
          rpcClient.emit = emit;
        },
    );
    return rpcClient;
  };

  options.onConnection((ws) => {
    let terminated;
    let rpcClient;
    ws.onmessage = (__message) => {
      if (terminated) return;
      const eventId = __message && __message[0];
      const value = __message && __message[1];

      switch (eventId) {
        case WS_EVENT_CONNECT:
          if (rpcClient) return;
          rpcClient = getClient(value);
          const onmessage = rpcClient.onmessage = (message) => {
            terminated ? defers.push(message) : (
              ws.send(message[0]),
              message[1]()
            );
          };
          const defers = [];
          forEach(rpcClient.defers, onmessage);
          rpcClient.defers = defers;
          break;

        case WS_EVENT_MESSAGE:
          rpcClient && rpcClient.emit(value);
          break;
      }
    };
    ws.onclose = () => {
      terminated = 1;
    };
  });
};
