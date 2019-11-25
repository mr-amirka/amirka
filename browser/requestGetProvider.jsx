//const React = require('react');
//const { Component } = React;
//const request = require('../services/http').get;

const isEqual = require('../isEqual');
const single = require('../single');
const noop = require('../noop');

/*
{
  //select: [ 'title', 'image', 'imageMobile' ],
  order: [ "publishedon" ],
  offset: (pageId - 1) * limit,
  limit,
  where: [
    {
      parent: lastParent = parent || 0
    }
  ]
}
*/

module.exports = ({ dom, Component }) => {

  class RequestGet extends Component {
    constructor(props) {
      super(props);
      const self = this;
      const onChange = props.onChange || noop
      const __map = props.map || (v => v);
      let hasUnmount = true;
      self.state = {
        query: {},
        response: __map({})
      };
      const request = single(props.api);
      const update = (query) => {
        loading = inited = true;
        request(query).then((response) => {
          if (hasUnmount) return;
          loading = false;
          response = __map(response);
          self.setState({
            query,
            response
          });
          onChange(response);
        });
      };

      self.componentDidMount = () => {
        hasUnmount = false;
      };
      self.componentWillUnmount = () => {
        hasUnmount = true;
        request.cancel();
      };

      let lastQuery, inited, loading;
      self.render = () => {
        const props = self.props;
        const query = props.query;
        const state = self.state;

        if (!inited || !isEqual(lastQuery, query)) update(lastQuery = query);

        return props.render(state.response, loading, state.query) || null;
      };
    }
  }

  return RequestGet;
};
