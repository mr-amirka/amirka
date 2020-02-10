const WebSocket = require('ws');
const rpcRemoteClientWrapper = require('../remoteClientWrapper');
const jsonParse = require('../nodeTryJsonParse');

module.exports = (url, env, reconnectTimeout) => {
  return rpcRemoteClientWrapper(({url, onopen, onmessage, onclose}) => {
    let ws;
    try {
      ws = new WebSocket(url);
      ws.on('error', (err) => {
        console.error(err);
      });
      onopen && ws.on('open', onopen);
      ws.on('message', (data) => {
        onmessage && onmessage(jsonParse(data));
      });
      ws.on('close', () => {
        onclose && onclose();
      });
    } catch (ex) {
      onerror(ex);
    }
    return {
      send: (data, onFinally) => ws.send(JSON.stringify(data), onFinally),
      close: () => ws.terminate(),
    };
  }, url, env, reconnectTimeout);
};
