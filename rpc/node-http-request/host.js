const parse = require('co-body');
const isArray = require('../../isArray');
const forEach = require('../../forEach');
const merge = require('../../merge');
const rpcRemoteHostWrapper = require('../remoteHostWrapper');

module.exports = (options) => {
  let router;
  rpcRemoteHostWrapper(merge([options, {
    onConnection: (connection) => {
      router = async (ctx) => {
        const responseMessages = [];
        const socket = {
          send: (message, onFinally) => {
            if (closed) {
              onFinally('closed');
              return;
            }
            responseMessages.push(message);
            onFinally();
          },
        };
        connection(socket);
        const {onmessage, onclose} = socket;

        const query = ctx.query;
        const callback = query.callback;

        if (onmessage) {
          const requestMessages = ctx.method === 'GET'
            ? query.messages
            : await parse.json(ctx);
          isArray(requestMessages) && forEach(requestMessages, onmessage);
        }

        closed = true;
        onclose && onclose();
        const response = JSON.stringify(responseMessages);

        ctx.body = callback ? `${callback}(${response})` : response;
      };
    },
  }]));
  return router;
};
