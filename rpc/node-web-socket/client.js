const WebSocket = require('ws');
const merge = require('../merge');
const noop = require('../noop');
const rpcRemoteClientWrapper = require('../remoteClientWrapper');
const jsonParse = require('../nodeTryJsonParse');

function onerror(err) {
  console.error(err);
}

module.exports = (options) => {
  return rpcRemoteClientWrapper(merge([options, {
    init: (instance) => {
      const onmessage = instance.onmessage || noop;
      let ws;
      try {
        ws = new WebSocket(instance.url);
        ws.on('error', onerror);
        ws.on('open', instance.onopen || noop);
        ws.on('message', (data) => {
          onmessage(jsonParse(data));
        });
        ws.on('close', instance.onclose || noop);
      } catch (ex) {
        onerror(ex);
      }
      return {
        send: (data, onFinally) => ws.send(JSON.stringify(data), onFinally),
        close: () => ws && ws.terminate(),
      };
    },
  }]));
};
