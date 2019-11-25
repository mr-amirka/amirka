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
          children: node.innerHTML || null
        });
        return true;
      } catch(ex) {
        console.error(ex, options, node);
      }
    });
    const set = instance.set = (name, handler) => {
      widgets[name] = (ctx) => {
        handler(extend({ name }, ctx));
      };
      return instance;
    };
    instance.adapt = (name, ReactComponent) => {
      set(name, (ctx) => {
        const props = {
          ...ctx.options,
          children: ctx.children
        };
        render((<ReactComponent { ...props } />), ctx.node);
      });
      return instance;
    };
    return instance;
  };

};

const recursiveNodeProvider = (handler) => {
  const recursiveCheckNode = (node) => {
    handler(node) || forEach(node.children, recursiveCheckNode);
  };
  const __recursiveCheckNode = (node) => {
    handler(node) || forEach(node.childNodes, __recursiveCheckNode);
  };
  return (node) => {
    node.children ? recursiveCheckNode(node) : __recursiveCheckNode(node);
  };
};

const getAttrsIteratee = (props, attrNode) => {
  props[attrNode.nodeName] = attrNode.nodeValue;
  return props;
};
const getAttrs = (attrs, output) => reduce(attrs, getAttrsIteratee, output || {});

const extendOptions = (options, value) => {
  try {
    value && extend(options, (new Function('return ' + value))());
  } catch(ex) {
    console.error(ex, value);
  }
  return options;
};
