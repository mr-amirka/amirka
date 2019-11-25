const Deal = require('../CancelablePromise');
const dynamicModule = require('./dynamicModule');
const dynamic = require('./dynamic');

module.exports = dynamicModule((options) => {
  return dynamic('https://vk.com/js/api/openapi.js?160').then(() => {
    return new Deal((resolve) => {
      VK.init(options);
      resolve();
    });
  });
});
