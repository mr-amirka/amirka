const rpcNodeWebSocketClient = require('mn-utils/rpc/node-web-socket/client');

rpcNodeWebSocketClient({
  url: [
    'ws://localhost:8081',
  ],
}).then((module) => {
  const {exports, terminate} = module; // eslint-disable-line
  const {log, info} = exports;

  log('Vasya!').then((response) => {
    console.log({vasyaResponse: response});
  });

  info('Пупкин!', (text) => {
    console.log('Выполнил колбэк с: ', text);
  }).then((response) => {
    console.log({pupkinResponse: response});
  }, (err) => {
    console.error(err);
  });

  info('ещё один!', (text) => {
    console.log('Так: ', text);
  }).then((response) => {
    console.log({pupkinResponse: response});
  }, (err) => {
    console.error(err);
  });

  log('уже второй!').then((response) => {
    console.log({vasyaResponse: response});
  });
});
