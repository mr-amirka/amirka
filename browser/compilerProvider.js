const forEach = require('../forEach');
const reduce = require('../reduce');
const extend = require('../extend');

module.exports = (_) => {
  const {render} = _;
  return (attrName) => {
    attrName || (attrName = 'mn-widget');
    const optionsAttrName = attrName + '-options';
    const widgets = {};
    const instance = recursiveNodeProvider((node) => {
      const attrs = getAttrs(node.attributes);
      const widgetName = attrs[attrName];
      if (!widgetName) return;
      const widget = widgets[widgetName];
      if (!widget) {
        console.error('Widget "' + widgetName + '" is undefined');
        return;
      }
      const options = extendOptions({}, attrs[optionsAttrName]);

      try {
        widget({
          node,
          options,
          attrs,
          children: node.innerHTML || null,
        });
        return true;
      } catch (ex) {
        console.error(ex, options, node);
      }
    });
    function set(name, handler) {
      widgets[name] = (ctx) => {
        handler(extend({name}, ctx));
      };
      return instance;
    }
    instance.set = set;
    instance.adapt = (name, ReactComponent) => {
      set(name, (ctx) => {
        render((<ReactComponent
          {...ctx.options}
          children={ctx.children}
        />), ctx.node);
      });
      return instance;
    };
    return instance;
  };
};

function recursiveNodeProvider(handler) {
  function recursiveCheckNode(node) {
    handler(node) || forEach(node.childNodes, recursiveCheckNode);
  }
  return recursiveCheckNode;
}
function getAttrsIteratee(props, attrNode) {
  props[attrNode.nodeName] = attrNode.nodeValue;
  return props;
}
function getAttrs(attrs, output) {
  return reduce(attrs, getAttrsIteratee, output || {});
}
function extendOptions(options, value) {
  try {
    value && extend(options, (new Function('return ' + value))());
  } catch (ex) {
    console.error(ex, value);
  }
  return options;
}
