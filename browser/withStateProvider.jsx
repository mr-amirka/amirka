const combine = require('../Emitter/combine');

module.exports = ({ dom, PureComponent }) => {

  return (render, emitters) => {

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
        self.render = () => {
          return render.apply(null, [
            self.props,
            self.state,
            setState
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
