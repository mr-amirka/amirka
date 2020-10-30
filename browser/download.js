const CancelablePromise = require('../CancelablePromise');
const extend = require('../extend');
const ready = require('./ready');
const d = document;

const DEFAULT_MIME = 'application/json';

function base(url, filename) {
  return (new CancelablePromise((resolve) => {
    ready(() => {
      const link = extend(d.createElement('a'), {
        href: url,
        download: filename || ('' + 1 * new Date()),
        target: '_blank',
        style: 'display:none;',
      });
      /* fix for Firefox gecko */
      const body = d.body;
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      resolve(true);
    });
  })).finally();
}

module.exports = (text, type, filename) => {
  return base(URL.createObjectURL(
      new Blob([text], {type: type || DEFAULT_MIME}),
  ), filename);
};
