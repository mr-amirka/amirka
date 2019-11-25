const sha512 = require('js-sha512');

const dealDelay = require('../CancelablePromise').delay;

const normalizeKey = key => typeof key === 'object' ? sha512(JSON.stringify(key)) : key;

const CACHE_EXPIRES_PROMISE = 0;
const CACHE_VALUE = 1;

module.exports = (expires) => {
  expires || (expires = 3600000);
  const cache = new Map();
  const __remove = key => {
    cache.delete(key);
  };
  return {
    set: (key, value) => {
      key = normalizeKey(key);
      const item = cache.get(key);
      if (value === null || value === undefined) {
        if (item) {
          item[CACHE_EXPIRES_PROMISE].cancel();
          cache.delete(key);
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
      cache.set(key, [ promise, value ]);
    },
    get: (key) => {
      key = normalizeKey(key);
      const item = cache.get(key);
      if (!item) return null;
      item[CACHE_EXPIRES_PROMISE].cancel();
      item[CACHE_EXPIRES_PROMISE] = dealDelay(expires, key).then(__remove);
      return item[CACHE_VALUE];
    },
    delete: (key) => {
      key = normalizeKey(key);
      const item = cache.get(key);
      if (item) {
        item[CACHE_EXPIRES_PROMISE].cancel();
        cache.delete(key);
      }
    }
  };
};
/*
const cache = cacheProvider();
const getCache = cache.get;
const setCache = cache.set;
*/
