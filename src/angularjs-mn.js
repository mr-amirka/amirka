
const provider = module.exports = (ngModule) => {
	ngModule.directive('m', function() {
    return function(scope, element, attrs){
    	check(attrs.m);
      deferCompile();
    };
	});
};
const mn = provider.mn = require('../services/mn');
const check = provider.check = mn.getCompiler('m');
const deferCompile = mn.deferCompile;
