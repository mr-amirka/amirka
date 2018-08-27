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
  mode: 'development',
  resolve: {
    extensions: [ '.ts', '.js', '.jsx' ]
  },
  entry: {
    'angular': './examples/angular/index.ts',
    'react': './examples/react/index.jsx',
    'simple': './examples/simple/index.ts',
    'amirka': './examples/standalone/index.ts',
    'assets/amirka.minimalist-notation': './examples/standalone/minimalist-notation.ts',
    'assets/mn-styles/mn.settings': './src/standalone-mn-styles/mn.settings.ts',
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
        test: /\.(locale|xhr)\.json$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              //name: 'assets/[path][name].[hash].[ext]'
              name: '[name].[hash].[ext]',
              outputPath: 'assets/xhr/'
            }
          }
        ]
      },
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
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: 'tsconfig.json',
              useBabel: true,
              babelOptions: {
                babelrc: false,
                presets: [ "@babel/preset-env" ]
              },
              babelCore: "@babel/core", 
            }
          },
          {
            loader: 'angular2-template-loader'
          }
          
        ],
        exclude: [ /\.spec\.ts$/ ]
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [ "react", "latest" ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader",
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
            loader: "style-loader"
          }, {
            loader: "css-loader",
            options: {
              minimize: true
            }
          }, {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader",
            options: {
              minimize: true
            }
          }, {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf|mp3)$/, 
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/static/'
            }
          }
        ]
      },
      //{ test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf)$/, loader: 'url-loader?limit=100000' },
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
          }
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: "html-loader"
          },
          {
            loader: "markdown-loader",
            options: {
              langPrefix: ''
              /* your options here */
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/angular/index.html',
      filename: 'index.html',
      chunks: [ 'angular' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/react/index.html',
      filename: 'react.html',
      chunks: [ 'react' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: 'simple.html',
      template: 'examples/simple/index.html',
      chunks: [ 'simple' ]
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

  