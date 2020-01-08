const fs = require('fs');
const Path = require('path');

module.exports = (outputFileName, content, onFinally) => {
  const dirname = Path.dirname(outputFileName);
  dirname ? fs.mkdir(dirname, {recursive: true}, write) : write();
  function write(err) {
    err
      ? onFinally(err)
      : fs.writeFile(outputFileName, content, 'utf8', onFinally);
  }
};
