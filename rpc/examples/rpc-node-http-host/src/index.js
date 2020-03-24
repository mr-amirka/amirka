const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();

app.use(cors());
app.use(require('mn-back-utils/query-parse'));

const rpcNodeHttpRequestHost = require('mn-utils/rpc/node-http-request/host');

app.use(rpcNodeHttpRequestHost({
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
}));

app.listen(8081);
