const noop = require('../noop');
const combine = require('../emitterProvider/combine');

module.exports = ({ PureComponent }) => {


  class State extends PureComponent {
    constructor(props) {
      super(props);
      const self = this;
      const emitter = combine(props.state);//.delay();
      const __map = props.map || (v => v);
      const onChange = props.onChange || noop;
      self.state = __map(emitter.getValue());

      let subscription;
      self.componentDidMount = () => {
        subscription || (subscription = emitter.on((values) => {
          self.setState(__map(values));
        }));
      };
  		self.componentWillUnmount = () => {
  	    if (subscription) {
          subscription();
          subscription = null;
        }
  	  };
      const change = (state) => {
        self.setState(state);
        onChange(state);
      };
      self.render = () => self.props.render(self.state, change) || null;
    }
  }
  return State;
};
