const sha512 = require('./sha512');
const dealDelay = require('./CancelablePromise').delay;
const jsonStringify = require('./jsonStringify');

function normalizeKey(key) {
  return typeof key === 'object' ? sha512(jsonStringify(key)) : key;
}

const CACHE_EXPIRES_PROMISE = 0;
const CACHE_VALUE = 1;

module.exports = (expires) => {
  expires || (expires = 3600000);
  const cache = {};
  function __remove(key) {
    delete cache[key];
  }
  return {
    set: (key, value) => {
      key = normalizeKey(key);
      const item = cache[key];
      if (value === null || value === undefined) {
        if (item) {
          item[CACHE_EXPIRES_PROMISE].cancel();
          delete cache[key];
        }
        return;
      }
      const promise = dealDelay(expires, key).then(__remove);
      if (item) {
        item[CACHE_EXPIRES_PROMISE].cancel();
        item[CACHE_EXPIRES_PROMISE] = promise;
        item[CACHE_VALUE] = value;
        return;
      }
      cache[key] = [promise, value];
    },
    get: (key) => {
      key = normalizeKey(key);
      const item = cache[key];
      if (item) {
        item[CACHE_EXPIRES_PROMISE].cancel();
        item[CACHE_EXPIRES_PROMISE] = dealDelay(expires, key).then(__remove);
        return item[CACHE_VALUE];
      }
    },
    delete: (key) => {
      const item = cache[key = normalizeKey(key)];
      if (item) {
        item[CACHE_EXPIRES_PROMISE].cancel();
        delete cache[key];
      }
    },
  };
};

/*
const cache = cacheProvider();
const getCache = cache.get;
const setCache = cache.set;
*/
