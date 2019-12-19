/**
 * @overview withStateProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * @example
const withState = withStateProvider({
  Component: Component
});

const AnyComponent = withState((setState, self) => {
  return (state, props) => {
    return (
      <div>{state.limit}</div>
    );
  };
}, {
  limit: 10
});
*/

const childClass = require('../childClass');
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
          self.state,
          self.props,
        ]);
      };
      self.UNSAFE_componentWillMount = () => {
        _subscription || (_subscription = emitter.on(setState));
      };
      self.componentWillUnmount = () => {
        _subscription && (_subscription(), _subscription = 0);
      };
      let _subscription;
      const setState = self.setState.bind(self);
      const render = constructor(setState, self);
    });
  };
};
