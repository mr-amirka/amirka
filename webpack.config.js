/**
*  добавить переменную через терминал
* export CHROME_BIN=/usr/bin/chromium-browser
*/

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    extensions: [ '.ts', '.js' ]
  },
  entry: {
    'assets/docs': './examples/docs/index.ts',
    'assets/simple': './examples/simple/index.js',
    'assets/amirka': './examples/standalone/index.js',
    'assets/amirka.minimalist-notation': './examples/standalone/minimalist-notation.js',
    'assets/mn-styles/mn.settings': './src/standalone-mn-styles/mn.settings.js',
    'assets/mn-styles/mn.style': './src/standalone-mn-styles/mn.style.js',
    'assets/standalone-shims/promise.shim': './src/standalone-shims/promise.shim.js',
    'assets/standalone-shims/css.escape.shim': './src/standalone-shims/css.escape.shim.js',
    'assets/standalone-shims/set-immediate.shim': './src/standalone-shims/set-immediate.shim.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.rs$/,
        type: 'webassembly/experimental',
        use: {
          loader: 'rust-native-wasm-loader',
          options: { gc: true, release: true }
        }
      },
      {
        test: /\.ts$/,
        use: [
          'awesome-typescript-loader?configFileName=tsconfig.json',
          'angular2-template-loader'
        ],
        exclude: /\.spec\.ts$/
      },
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
        exclude: /node_modules/,
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
      { test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.html?$/,
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
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/docs/index.html',
      chunks: [ 'assets/docs' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: 'simple.html',
      template: 'examples/simple/index.html',
      chunks: [ 'assets/simple' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: 'standalone.html',
      template: 'examples/standalone/index.html',
      chunks: [ 
        'assets/amirka.minimalist-notation', 
        'assets/mn-styles/mn.settings',
        'assets/mn-styles/mn.style'
      ]
    }),
    /*
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      __dirname + '/examples',
      {}
    ),
    */
    new webpack.LoaderOptionsPlugin({
      debug: false,
      options: {
        htmlLoader: {
          // minimize: false // workaround for ng2
          // see https://github.com/angular/angular/issues/10618#issuecomment-250322328
          minimize: false,
          removeAttributeQuotes: false,
          caseSensitive: true
          // customAttrSurround: [
          //   [/#/, /(?:)/],
          //   [/\*/, /(?:)/],
          //   [/\[?\(?/, /(?:)/]
          // ],
          // customAttrAssign: [/\)?\]?=/]
        }
      }
    })
    /*
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        htmlLoader: {
          minimize: false // workaround for ng2
        }
      }
    })
    */
  ]

};

  