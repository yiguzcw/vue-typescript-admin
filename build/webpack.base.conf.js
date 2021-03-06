var path = require('path')
var webpack = require('webpack');
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var svgoConfig = require('../config/svgo-config.json')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: utils.getMultiEntry(config.entry.js),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      'vue': 'vue/dist/vue.esm.js',
    }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      enforce: 'pre',
      loader: 'tslint-loader'
    },
    {
      test: /\.(jsx?|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [resolve('src'), resolve('test')],
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: Object.assign(vueLoaderConfig, {
        loaders: {
          ts: "awesome-typescript-loader",
          tsx: "awesome-typescript-loader"
        }
      })
    },
    {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test')]
    },
    {
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      options: {
        useCache: true,
        useBabel: true,
        babelOptions: {
          "babelrc": true
        },
        useTranspileModule: true,
        transpileOnly: true
      },
      include: [resolve('src'), resolve('test')]
    },
    {
      test: /\.pug$/,
      loader: 'pug-loader',
      options: {
        globals: ['process']
      }
    },
    {
      test: /\.html$/,
      loader: 'vue-html-loader'
    },
    {
      test: /\.svg$/,
      use: ['svg-sprite-loader', 'svgo-loader?' + JSON.stringify(svgoConfig)],
      include: [resolve('src/assets/icons')]
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      exclude: [resolve('src/assets/icons')],
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[ext]')
      }
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('media/[name].[ext]')
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[ext]')
      }
    }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor_manifest.json')
    }),
  ]
}
