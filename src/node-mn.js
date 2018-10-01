
const fs = require("fs");
const Path = require("path");
const parserProvider = require("./mn-parser");
const compileProvider = require("./mn-compile");

const {
  forIn,
  mapValues,
  reduce,
  isArray,
  isObject
  //,withDelay
} = require("./utils");


const defaultSettings = module.exports.defaultSettings = {
  input: './',
  output: './mn.styles.css',
  include: /^.*\.(html?|(js|ts)x?|vue)$/,
  exclude: /\/node_modules\/|(.*\.tmp)/,
  attrs: [ 'm' ],
  presets: [
    require('./mn-presets/mn.medias'),
  	require('./mn-presets/mn.prefixes'),
  	require('./mn-presets/mn.styles'),
  	require('./mn-presets/mn.states'),
  	require('./mn-presets/mn.theme')
  ]
};

const noop = () => {};
const parseSource = ({ input, include, exclude, watch }, each, callback) => {

  const cb = () => {
    callback && callback();
    /*
    watch && fs.watch(input, {
      recursive: true
    }, withDelay((eventType, path) => {
      console.log('eventType', eventType, path);

      //include && isInclude(path) ? fs.readFile(path, 'utf8', (err, text) => {
      //_each(path, text);
      //  callback && callback();
      //});

    }, 100));
    */
  };
  let count = 0;
  const inc = () => {
    count++;
  };
  const dec = () => {
    --count || cb();
  };
  const _each = each || noop;
  const isExclude = (path) => {
    if (isArray(exclude)) {
      for (i = exclude.length; i--;) {
        if ((v = exclude[i]) && v.test(path)) return true;
      }
    } else {
      if (exclude.test(path)) return true;
    }
  };
  const isInclude = (path) => {
    if (isArray(include)) {
      for (let v, i = include.length; i--;) {
        if ((v = include[i]) && v.test(path)) return true;
      }
    } else {
      if (include.test(path)) return true;
    }
  };
  const core = (path) => {
    if (exclude && isExclude(path)) return;
    inc();
    const ps = path.indexOf('/');
    ps === 0 || ps === 1 || (path = './' + path);
    fs.stat(path, (err, stat) => {
      if (!stat) return dec();
      if (stat.isDirectory()) {
        const iteratee = (name) => {
          core(Path.join(path, name));
        };
        fs.readdir(path, (err, list) => {
          list && list.forEach(iteratee);
          dec();
        });
        return;
      }

      include && isInclude(path) ? fs.readFile(path, 'utf8', (err, text) => {
        text && _each(path, text);
        dec();
      }) : dec();

    });
  };

  core(input);
};

module.exports.compileSource = (__options) => {
  const cache = {};
  const __compileSource = (options) => {
    let {
      input,
      output,
      include,
      exclude,
      metrics,
      presets,
      attrs,
      watch,
      hideInfo
    } = options;
    const parse = parserProvider(attrs);
    if (!parse) return;
    const compile = compileProvider(presets);

    console.log('mn input:', input);
    parseSource({
      input, include, exclude, watch
    }, (_path, text) => {
      const path = Path.resolve(_path);
      if (!text) {
        delete cache[path];
        return;
      }
      const count = parse(cache[path] = {}, text);
      hideInfo || console.log('mn found', count, 'essences in', _path);
    }, () => {
      const attrsMap = {};
      const attrsIteratee = (essencesNames, attrName) => {
        const values = attrsMap[attrName] || (attrsMap[attrName] = {});
        forIn(essencesNames, (item, name) => {
          (values[name] || (values[name] = {
            name,
            count: 0
          })).count += item.count;
        });
      };
      forIn(cache, (srcAttrsMap) => {
        forIn(srcAttrsMap, attrsIteratee);
      });

      const cssText = compile(attrsMap);

      output || (output = input + '.css');

      fs.writeFile(checkPath(output), cssText, (err) => {
        err ? console.error(err) : console.log('mn output:', output);
      });

      metrics && fs.writeFile(
        checkPath(metrics),
        JSON.stringify(
          mapValues(cache, (attrsMap) => {
            return Object.values(attrsMap).sort(__sort);
          }), null, '  '
        ),
        __onError
      );
    });
  };

  const settings = {
    ...defaultSettings,
    ...__options
  };

  let {
    input
  } = settings;


  isObject(input)
    ? forIn(input, (_options, _output) => {
        _output += '.css';
        isObject(_options)
          ? __compileSource({
            ...settings,
            ..._options,
            output: _output
          })
          : __compileSource({
            ...settings,
            input: _options,
            output: _output
          })
    })
    : __compileSource(settings);
};
const __sort = (a, b) => b.count - a.count;
const __onError = (err) => {
  err && console.error(err);
};
const regexpPathSplit = /[\/\\]+/;
const checkPath = (filename) => {
  const parts = filename.split(regexpPathSplit);
  let path = parts.shift();
  parts.forEach((partName) => {
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    path += '/' + partName;
  });
  return filename;
};
