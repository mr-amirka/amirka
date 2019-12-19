/**
 * @overview withStateProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * @example
const withState = withStateProvider({
  Component: Component
});

const AnyComponent = constructorWithState((self, setState) => {
  return (props, state) => {
    return (
      <div>{state.limit}</div>
    );
  };
}, {
  limit: 10
});
*/

const childClass = require('./childClass');
const combine = require('../Emitter/combine');

module.exports = (env) => {
  const {Component} = env;
  return (constructor, emitters) => {
    const emitter = combine(emitters);
    return childClass(Component, function() {
      const self = this;
      self.state = emitter.getValue();
      self.render = () => {
        return render.apply(self, [
          self.props,
          self.state,
        ]);
      };
      self.UNSAFE_componentDidMount = () => {
        subscription || (subscription = emitter.on(setState));
      };
      self.UNSAFE_componentWillUnmount = () => {
        subscription && (subscription(), subscription = 0);
      };
      let subscription;
      const setState = self.setState.bind(self);
      const render = constructor(self, setState);
    });
  };
};
