const rpcNodeWebSocketHost = require('mn-utils/rpc/node-web-socket/host');

rpcNodeWebSocketHost({
  ws: {
    port: 8081,
  },
  init: (env) => {
    return {
      log: (...args) => {
        console.log(...args);
        return 'Доставлено!';
      },
      info: (text, fn) => {
        console.info(text);
        fn('на сервере!');
        throw 'ошибка!';
        return 'Info видел!';
      },
    };
  },
});
