/**
 * @overview dynamic
 * @author Amir Absolutely <mr.amirka@ya.ru>

@example
dynamic('https://api-maps.yandex.ru/2.1/?load=package.full&lang=ru-RU').then(() => {
  window.ymaps.ready(() => {

  })
});

dynamic('https://api-maps.yandex.ru/2.1/', {
  load: 'package.full',
  lang: 'ru-RU'
}).then(() => {
  window.ymaps.ready(() => {

  })
});
*/


const decorate = require('../decorate');
const urlExtend = require('../urlExtend');
const script = require('./script').base;
const cache = {};
module.exports = decorate((url, options) => {
  const _options = urlExtend(url, options);
  const href = _options.href;
  return cache[href] || (cache[href] = script(_options).catch((err) => {
    delete cache[href];
    throw err;
  }));
});
