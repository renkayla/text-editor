const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = (env, argv) => {
  const isWatchMode = argv.mode === 'development' && argv.watch;

  return {
    mode: 'development',
    entry: {
      main: './client/src/js/index.js',
      install: './client/src/js/install.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, './client/client/dist'),
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './client/index.html',
        inject: true,
        chunks: ['main'],
      }),
      new WebpackPwaManifest({
        filename: 'manifest.json',
        name: 'Text Editor',
        short_name: 'Editor',
        description: 'Progressive Web App Text Editor',
        background_color: '#ffffff',
        crossorigin: 'use-credentials',
        icons: [
          {
            src: path.resolve('client/src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
      isWatchMode ? null : new InjectManifest({
        swSrc: './client/src-sw.js',
      }),
    ].filter(Boolean),

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
    },
  };
};
