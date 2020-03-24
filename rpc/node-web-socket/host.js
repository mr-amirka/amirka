const WebSocketServer = new require('ws'); // eslint-disable-line
const rpcRemoteHostWrapper = require('../remoteHostWrapper');
const jsonParse = require('../nodeTryJsonParse');
const merge = require('../../merge');

module.exports = (options) => {
  return rpcRemoteHostWrapper(merge([options, {
    onConnection: (connection) => {
      const webSocketServer = new WebSocketServer.Server(options.ws);
      webSocketServer.on('connection', (ws) => {
        const socket = {
          send: (message) => {
            ws.send(JSON.stringify(message))
          },
        };
        connection(socket);
        const {onmessage, onclose} = socket;
        onmessage && ws.on('message', (message) => {
          onmessage(jsonParse(message));
        });
        onclose && ws.on('close', onclose);
      });
    },
  }]));
};
