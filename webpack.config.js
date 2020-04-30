const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, 'dist/');

module.exports = (_env, argv) => {
  const entryPoints = {
    VideoComponent: {
      path: './src/VideoComponent.js',
      outputHtml: 'video_component.html',
      build: true,
    },
    VideoOverlay: {
      path: './src/VideoOverlay.js',
      outputHtml: 'video_overlay.html',
      build: true,
    },
    Panel: {
      path: './src/Panel.js',
      outputHtml: 'panel.html',
      build: true,
    },
    Config: {
      path: './src/Config.js',
      outputHtml: 'config.html',
      build: true,
    },
    LiveConfig: {
      path: './src/LiveConfig.js',
      outputHtml: 'live_config.html',
      build: true,
    },
    Mobile: {
      path: './src/Mobile.js',
      outputHtml: 'mobile.html',
      build: true,
    },
  };

  const entry = {};

  // Get the root path
  const currentPath = path.join(__dirname);
  // Create the fallback path (the production .env)
  const basePath = `${currentPath}/.env`;
  // Check if the file exists, otherwise fall back to the production .env
  const finalPath = basePath;
  // Set the path parameter in the dotenv config
  const fileEnv = dotenv.config({ path: finalPath }).parsed;
  // reduce it to a nice object, the same as before (but with the variables from the file)
  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]); // eslint-disable-line no-param-reassign
    return prev;
  }, {});

  // edit webpack plugins here!
  const plugins = [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(envKeys),
  ];

  const keys = Object.keys(entryPoints);
  for (let i = 0; i < keys.length; i++) {
    const name = keys[i];
    if (entryPoints[name].build) {
      entry[name] = entryPoints[name].path;
      if (argv.mode === 'production') {
        plugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            chunks: [name],
            template: './template.html',
            filename: entryPoints[name].outputHtml,
          }),
        );
      }
    }
  }

  const config = {
    // entry points for webpack- remove if not used/needed
    entry,
    optimization: {
      minimize: false, // this setting is default to false to pass review more easily. you can opt to set this to true to compress the bundles, but also expect an email from the review team to get the full source otherwise.
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', // creates style nodes from JS strings
            'css-loader', // translates CSS into CommonJS
            'sass-loader', // compiles Sass to CSS, using Node Sass by default
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          },
        },
      ],
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
      filename: '[name].bundle.js',
      path: bundlePath,
    },
    plugins,
  };

  if (argv.mode === 'development') {
    config.devServer = {
      contentBase: path.join(__dirname, 'public'),
      host: argv.devrig ? 'localhost.rig.twitch.tv' : 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      port: 8080,
    };
    config.devServer.https = true;
  }
  if (argv.mode === 'production') {
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          chunks: 'all',
          test: /node_modules/,
          name: false,
        },
      },
      name: false,
    };
  }

  return config;
};
