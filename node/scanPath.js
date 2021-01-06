const fs = require('fs');
const Path = require('path');
const finallyAll = require('../finallyAll');

const regexpPath = /^\.?\.?\/.*/;

module.exports = ({path, each, callback, exclude}) => {
  finallyAll((inc, dec) => {
    const _each = each || noop;
    const _exclude = exclude || noop;
    function base(path) {
      inc();
      if (_exclude(path)) return dec();
      regexpPath.test(path) || (path = './' + path);
      fs.stat(path, (err, stat) => {
        if (!stat) return dec();
        if (stat.isDirectory()) {
          function iteratee(name) {
            base(Path.join(path, name));
          }
          fs.readdir(path, (err, list) => {
            list && list.forEach(iteratee);
            dec();
          });
        } else {
          _each('found', path);
          dec();
        }
      });
    }
    base(path);
  }, callback);
};
