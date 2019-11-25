const create = require('./create');
const extend = require('./extend');

module.exports = (Parent, constructor, proto) => {
  function Child() {
    Parent.apply(this, arguments); //eslint-disable-line
    constructor.apply(this, arguments); //eslint-disable-line
  }
  Child.prototype = extend(create(Parent.prototype), proto);
  return Child;
};
