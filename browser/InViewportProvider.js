/**
 * @overview InViewportProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * @example
 * const InViewport = InViewportProvider({
 *   Component: Component,
 *   createElement: createElement,
 * });
*/

const without = require('../without');
const childClass = require('../childClass');
const combine = require('../Emitter/combine');
const getViewportSize = require('./getViewportSize');

const withoutProps = ['component', 'ref', 'render', 'state'];

module.exports = (env) => {
  const {createElement} = env;
  return childClass(env.Component, function(props) {
    const self = this;
    const setState = self.setState.bind(self);
    const emitter = combine(props.state || {});
    const {getValue} = emitter;
    let _ref;
    let _subscription;
    function handleRef(ref) {
      ref && ref !== _ref && (_ref = ref, setState(getValue()));
    }
    self.state = getValue();
    self.render = () => {
      const {props} = self;
      const {ref} = props;
      const rect = _ref && _ref.getBoundingClientRect();
      return createElement(
          props.component || 'div',
          without(props, withoutProps, {
            ref: ref ? (_ref) => {
              handleRef(_ref);
              ref(_ref);
            } : handleRef,
          }),
          !rect || rect.bottom < 0 || rect.top > getViewportSize()[1]
            ? null
            : props.render(self.state),
      );
    };
    self.UNSAFE_componentWillMount = () => {
      _subscription || (
        _subscription = emitter.on(setState),
        setState(getValue())
      );
    };
    self.componentWillUnmount = (w) => {
      _subscription && (
        _subscription(),
        _subscription = 0
      );
    };
  });
};
