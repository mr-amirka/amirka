/**
 * @overview script
 * Загрузчик скриптов
 *
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */

const once = require('../once');
const defer = require('../defer');
const urlExtend = require('../urlExtend');
const Deal = require('../CancelablePromise');

const script = module.exports = (url, options) => base(urlExtend(url, options).href);
const base = script.base = (url) => {
  return new Deal((resolve, reject) => {
    const instance = document.createElement('script');
    const head = document.getElementsByTagName('head')[0];
    const execute = instance.onload = once(() => {
      defer(remove);
      resolve();
    });
    instance.onreadystatechange = () => /complete|loaded/.test(instance.readyState) && execute();
    instance.type = 'text/javascript';
    instance.charset = 'utf-8';
    instance.async = true;
    instance.src = url
    const remove = once(() => head.removeChild(instance));
    head.appendChild(instance);
    return () => {
      remove();
      instance.abort && instance.abort();
    };
  });
};
