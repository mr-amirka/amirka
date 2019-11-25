const Deal = require('../CancelablePromise');
const dynamicModule = require('./dynamicModule');
const dynamic = require('./dynamic');

module.exports = dynamicModule((options) => {
  return dynamic('https://api-maps.yandex.ru/2.1/', {
    query: {
      load: 'package.full',
      lang: 'ru-RU'
    }
  }).then(() => {
    console.log('yaMapModule is loaded!');
    return new Deal((resolve) => {
      const ymaps = window.ymaps;
      ymaps.ready(() => {
        resolve(ymaps);
      });
    });
  });
});
