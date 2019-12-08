/**
 * @overview constructorWithStateProvider
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * @example
const constructorWithState = constructorWithStateProvider({
  PureComponent: PureComponent
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


const combine = require('../Emitter/combine');

module.exports = (_) => {
  const { PureComponent } = _;
  return (constructor, emitters) => {

    const emitter = combine(emitters);

    class Wrapper extends PureComponent {
      constructor(props){
        super(props);
        const self = this;
        let subscription;

        const setState = (state) => {
          self.setState(state);
        };
        self.state = emitter.getValue();

        const render = constructor(self, setState);

        self.render = () => {
          return render.apply(null, [
            self.props,
            self.state
          ]);
        };
        self.componentDidMount = () => {
          if (!subscription) subscription = emitter.on(setState);
        };
        self.componentWillUnmount = () => {
          if (subscription) {
            subscription();
            subscription = null;
          }
        };
      }
    }

    return Wrapper;
  };
};
