const forEach = require('../forEach');
const delay = require('../delay');
const Deal = require('../CancelablePromise');
const {rpcProvider} = require('./rpcWrapper');
const isHasFunctions = require('./isHasFunctions');
const urlGetterProvider = require('./urlGetterProvider');

const RECONNECT_TIMEOUT = 5000;
const NEXT_CONNECT_TIMEOUT = 10;

const WS_EVENT_CONNECT = 0;
const WS_EVENT_MESSAGE = 1;

module.exports = (getConnect, url, env, reconnectTimeout) => {
  return new Deal((resolve, reject) => {
    let // eslint-disable-line
      __hasFirstConnect = 1,
      __terminated,
      __connected,
      __emit,
      __socket,
      __sessionId = 0,
      __defers = [];

    reconnectTimeout || (reconnectTimeout = RECONNECT_TIMEOUT);
    const getUrl = urlGetterProvider(url);

    function connect() {
      if (terminated) return;
      // console.log('connect...');
      const socket = __socket = getConnect({
        url: getUrl(),
        onclose: (hasNextConnect) => {
          if (__terminated) return;
          // console.log('onclose');
          __connected = 0;
          if (__hasFirstConnect) {
            __hasFirstConnect = 0;
            connect();
            return;
          }
          delay(
              connect,
              hasNextConnect ? NEXT_CONNECT_TIMEOUT : reconnectTimeout,
          );
        },
        onopen: (e) => {
          __connected = 1;
          const defers = __defers;
          __defers = [];

          socket.send([WS_EVENT_CONNECT, __sessionId]);
          forEach(defers, send);
        },
        onmessage: (message) => {
          if (__terminated) return;
          const eventId = message && message[0];
          const value = message && message[1];

          switch (eventId) {
            case WS_EVENT_CONNECT:
              __sessionId = value;
              break;

            case WS_EVENT_MESSAGE:
              __emit(value);
              break;
          }
        },
      });
    };

    function send(ctx) {
      __connected ? __socket.send(ctx[0], (err) => {
        err ? defers.push(ctx) : ctx[1]();
      }) : defers.push(ctx);
    }
    function terminate() {
      __terminated || (
        __terminated = 1,
        __socket && __socket.close(),
        __socket = 0
      );
    }

    connect();

    resolve(rpcProvider(
        env || {},
        0,
        (data) => {
          const promise = new Deal();
          send([[WS_EVENT_MESSAGE, data], promise.resolve]);
          return promise;
        },
        (emit) => {
          __emit = emit;
        },
    ).finally((err, response) => {
      !err && isHasFunctions(response) || terminate();
    }).then((exports) => ({
      terminate,
      exports,
    })));
    return terminate;
  });
};
