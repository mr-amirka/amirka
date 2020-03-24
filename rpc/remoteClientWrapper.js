const forEach = require('../forEach');
const delay = require('../delay');
const noop = require('../noop');
const CancelablePromise = require('../CancelablePromise');
const {rpcProvider} = require('./rpcWrapper');
const isHasFunctions = require('./isHasFunctions');
const urlGetterProvider = require('./urlGetterProvider');

const RECONNECT_TIMEOUT = 5000;
const NEXT_CONNECT_TIMEOUT = 10;

const WS_EVENT_CONNECT = 0;
const WS_EVENT_MESSAGE = 1;

module.exports = (options) => {
  return new CancelablePromise((resolve, reject) => {
    const init = options.init;
    const url = options.url;
    const env = options.env;
    const reconnectTimeout = options.reconnectTimeout || RECONNECT_TIMEOUT;
    const onSessionIdChange = options.onSessionIdChange || noop;
    let // eslint-disable-line
      __sessionId = options.sessionId || 0,
      __hasFirstConnect = 1,
      __terminated,
      __connected,
      __emit,
      __socket,
      __defers = [];

    const getUrl = urlGetterProvider(url);

    function connect() {
      if (__terminated) return;
      // console.log('connect...');
      const socket = __socket = init({
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
              __sessionId === value || onSessionIdChange(__sessionId = value);
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
        err ? __defers.push(ctx) : ctx[1]();
      }) : __defers.push(ctx);
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
          const promise = new CancelablePromise();
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
