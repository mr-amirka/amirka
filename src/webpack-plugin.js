
const { compileSource } = require('./node-mn');

module.exports = function(options) {

  this.apply = function(compiler) {

    compiler.plugin("done", function() {
      compileSource(options || {});
    });

  };

};
