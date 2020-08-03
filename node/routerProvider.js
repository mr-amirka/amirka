const pathToRegexp = require('path-to-regexp');
const once = require('../once');
const METHODS = require('./methods.enum');

function routerProvider() {
  const chain = chainProvider();
  const methods = {};
  function router(ctx, next) {
    return chain(ctx, () => {
      const _chain = methods[ctx.method];
      return _chain ? _chain(ctx, next) : next();
    });
  }
  router.use = (middleware) => {
    chain.use(middleware);
    return router;
  };
  router.mount = (path, middleware) => {
    chain.mount(path, middleware);
    return router;
  };
  router.route = (path, middleware) => {
    chain.route(path, middleware);
    return router;
  };
  METHODS.forEach((method) => {
    const methodUC = method.toUpperCase();
    router[method] = (path, middleware, onlyMount) => {
      (methods[methodUC] || (methods[methodUC] = chainProvider()))
          .use(middleware ? (
            (onlyMount ? mountProvider : routeProvider)(path, middleware)
          ) : path);
      return router;
    };
  });
  router.del = router.delete;
  return router;
}
function iterateeName(item) {
  return item.name;
}
function routeProvider(path, middleware) {
  let keys = [];
  const re = pathToRegexp(path, keys);
  keys = keys.map(iterateeName);
  return (ctx, next) => {
    const m = re.exec(ctx.path);
    if (!m) return next();
    const values = m.slice(1);
    const params = ctx.params = {};
    for (let _keys = keys, l = _keys.length, v, i = 0; i < l; i++) {
      params[_keys[i]] = (v = values[i]) ? decodeURIComponent(v) : v;
    }
    return Promise.resolve(middleware(ctx, next));
  };
}
function mountProvider(path, middleware) {
  const length = path.length;
  return (ctx, next) => {
    const originPath = ctx.path || '';
    if (originPath.startsWith(path)) {
      ctx.path = originPath.substr(length);
      return Promise.resolve(middleware(ctx, function() {
        ctx.path = originPath;
        return next.apply(this, arguments); // eslint-disable-line
      })).then((res) => {
        ctx.path = originPath;
        return res;
      }, (error) => {
        ctx.path = originPath;
        throw error;
      });
    }
    return next();
  };
}
function chainProvider() {
  const middlewares = [];
  function chain(ctx, next) {
    let i = 0;
    function _next() {
      const middleware = middlewares[i];
      i++;
      return middleware ? middleware(ctx, once(_next)) : next();
    }
    return _next();
  }
  chain.use = (middleware) => {
    middlewares.push(middleware);
    return chain;
  };
  chain.mount = (path, middleware) => {
    middlewares.push(mountProvider(path, middleware));
    return chain;
  };
  chain.route = (path, middleware) => {
    middlewares.push(routeProvider(path, middleware));
    return chain;
  };
  return chain;
};

function restProvider(methods) {
  return __rest(__map(methods));
}
function __map(src) {
  const dst = {};
  let k;
  for (k in src) dst[k.toUpperCase()] = src[k]; // eslint-disable-line
  return dst;
}
function __rest(methods) {
  return (ctx, next) => {
    const middleware = methods[ctx.method];
    return middleware ? middleware(ctx, next) : next();
  };
}

routerProvider.mount = mountProvider;
routerProvider.route = routeProvider;
routerProvider.rest = restProvider;
routerProvider.chain = chainProvider;
module.exports = routerProvider;
