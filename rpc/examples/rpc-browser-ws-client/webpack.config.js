const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  devServer: {
    contentBase: Path.join(__dirname, 'dist'),
    compress: true,
    open: true,
    port: 9000,
    openPage: 'index.html',
  },
  mode:
    // 'production',
    'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: __dirname + '/dist',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-flow',
              ],
              plugins: [
                '@babel/syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-proposal-decorators', {legacy: true}],
                ['@babel/plugin-transform-react-jsx', {
                  // default pragma is React.createElement
                  pragma: 'React.createElement',

                  // default is React.Fragment
                  pragmaFrag: 'React.Fragment',

                  // defaults to true
                  throwIfNamespace: false,
                }],
              ],
            },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf|eot|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/static/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['app'],
    }),
  ],
};
