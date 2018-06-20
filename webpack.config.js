/**
*  добавить переменную через терминал
* export CHROME_BIN=/usr/bin/chromium-browser
*/
const path = require('path');

module.exports = {
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    open: true,
    openPage: 'index.html',
    port: 9000,
  },
  mode: 'production',
  resolve: {
    extensions: [ '.js' ]
  },
  entry: {
    'amirka.base': './src/base/index.js',
    'amirka.common': './src/common/index.js',
    'amirka.minimalist-notation': './src/minimalist-notation/index.js',
    app: './src/example/index.js',
    'boot-app': './src/example/boot-app.js',
    'standalone-shims/promise.shim': './src/standalone-shims/promise.shim.js',
    'standalone-shims/css.escape.shim': './src/standalone-shims/css.escape.shim.js',
    'standalone-shims/set-immediate.shim': './src/standalone-shims/set-immediate.shim.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public/assets',
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              minimize: true
            }
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          }, {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              minimize: true
            }
          }, {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false,
              collapseWhitespace: false
            }
          }, {
            loader: 'highlightjs-loader'
          }
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: false,
              collapseWhitespace: false
            }
          }, {
            loader: 'highlightjs-loader'
          }, {
            loader: 'markdown-loader'
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }


    ]
  }

};

  