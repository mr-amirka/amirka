/**
*  добавить переменную через терминал
* export CHROME_BIN=/usr/bin/chromium-browser
*/

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MnWebpackPlugin = require('./src/webpack-plugin');


module.exports = {
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    open: true,
    openPage: 'index.html',
    port: 9000,
  },
  mode:
    //'production',
    'development',
  resolve: {
    extensions: [ '.ts', '.js', '.jsx' ]
  },
  entry: {
    'react': './examples/react/index',
    'standalone-mn': './examples/standalone/index',
    'ff.app': './examples/ff.tmp.app/embed.js',
    'ff.admin': './examples/ff.tmp.app/admin.jsx',
    'frame': './examples/ff.tmp.app/frame.jsx',
    'market': './examples/market.tmp.app/components/app.jsx',

    //'assets/promise.shim': './src/standalone-shims/promise.shim.js',
    'assets/css.escape.shim': './src/standalone-shims/css.escape.shim.js',
    'assets/set-immediate.shim': './src/standalone-shims/set-immediate.shim.js',

    'mn-presets/mn.settings': './examples/mn-presets/mn.settings.js',
    'mn-presets/mn.styles': './examples/mn-presets/mn.styles.js',
    'mn-presets/mn.theme': './examples/mn-presets/mn.theme.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              cacheDirectory: true,
              configFileName: 'tsconfig.json',
              useBabel: true,
              babelOptions: {
                babelrc: false,
                presets: [ "@babel/preset-env" ]
              },
              babelCore: "@babel/core",
            }
          }
        ],
        exclude: [ /\.spec\.ts$/, /\.tmp\.ts$/  ]
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [ "@babel/preset-env", "@babel/preset-react" ],
            plugins: [
              "@babel/syntax-dynamic-import",
              "@babel/plugin-proposal-class-properties",
              [ "@babel/plugin-proposal-decorators", { legacy: true } ]
           ]
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
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf|eot|mp3)$/,
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
      /*
      {
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf|eot|mp3)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000
            }
          }
        ]
      },
      */
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
      }
    ]
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/react/index.html',
      filename: 'react.html',
      chunks: [ 'react' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/standalone/index.html',
      filename: 'standalone.html',
      chunks: [ ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/ff.tmp.app/admin.html',
      filename: 'index.html',
      chunks: [ 'ff.admin' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/ff.tmp.app/frame.html',
      filename: 'frame.html',
      chunks: [ 'frame' ]
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'examples/market.tmp.app/index.html',
      filename: 'market.html',
      chunks: [ 'market' ]
    })

    ,new MnWebpackPlugin({
      input: {
        './dist/ff-mn-styles': './examples/ff.tmp.app',
        './dist/market-styles': './examples/market.tmp.app'
      },
      include: [ /^.*\.(html?|jsx?)$/ ],
      exclude: [ /\/node_modules\// ],
      hideInfo: true,
      presets: [
        require('./src/mn-presets/mn.medias'),
      	require('./src/mn-presets/mn.prefixes'),
      	require('./src/mn-presets/mn.styles'),
      	require('./src/mn-presets/mn.states'),
      	require('./src/mn-presets/mn.theme'),
        require('./examples/common.tmp.app/mn.theme')
      ]
    })

  ],
  optimization: {

    minimizer: [
      new UglifyJsPlugin({
        extractComments: false,
        sourceMap: false,
        uglifyOptions: {
          warnings: false,
          ie8: false,
          safari10: false,
          compress: {
            //drop_console: false,
            //unsafe_proto: true,
            unsafe_math: true,
            //hoist_vars: true
          },
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ]
    /*
    ,splitChunks: {
      name: true,
      cacheGroups: {
        src: {
          test: /[\\/]src[\\/]/,
          name: 'src',
          chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
    /*
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
    */
  }

};
