const WebSocketServer = new require('ws'); // eslint-disable-line
const rpcRemoteHostWrapper = require('../remoteHostWrapper');
const jsonParse = require('../nodeTryJsonParse');

module.exports = (options, init) => {
  return rpcRemoteHostWrapper(init, (connection) => {
    const webSocketServer = new WebSocketServer.Server(options);
    webSocketServer.on('connection', (ws) => {
      const socket = {
        send: (message) => ws.send(JSON.stringify(message)),
      };
      connection(socket);
      const {onmessage, onclose} = socket;
      onmessage && ws.on('message', (message) => {
        onmessage(jsonParse(message));
      });
      onclose && ws.on('close', onclose);
    });
  });
};
