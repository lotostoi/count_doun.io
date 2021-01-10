require('@babel/polyfill')
const path = require('path')
const HTML = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const webpack = require('webpack')

const isProduction = process.argv.join('').includes('production')
const isDevelopment = !isProduction

const conf = {
  context: path.resolve(__dirname, 'src'),
  mode: isProduction ? 'production' : 'development',
  entry: ['@babel/polyfill', './js/main.js'],

  output: {
    publicPath: !isProduction ? '/' : './',
    filename: 'js/[name].bundle.js',
    //path: path.resolve(__dirname, '/'),
  },
  resolve: {
    extensions: ['.js', '.scss', '.css', '.json', '.img', 'png'],
    alias: {
      vue: 'vue/dist/vue.js',
      '~': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src'),
      'anim': path.resolve(__dirname, 'src/assets/animations'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: {
            removeComments: false,
            collapseWhitespace: false,
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            /*  options: {
              publicPath: !isProduction ? '/' : '/src/css',
            }, */
          },
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            options: {
              //  publicPath: !isProduction ? '' : '../src',
              //  outputPath: 'css/[name][hash].css',
            },
          },
          'css-loader',
          'sass-loader',
        ],
        // include: path.resolve(__dirname, 'src/scss/**.scss'),
        sideEffects: true,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|gif|jpe|jpg)(\?.*$|$)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              publicPath: !isProduction ? '/' : '/src',
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              publicPath: !isProduction ? '/' : '/src',
              outputPath: 'font/',
            },
          },
        ],
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: /(lottie)/,
        loader: 'lottie-web-webpack-loader',
        options: {
          assets: {
            scale: 0.5, // proportional resizing multiplier
          },
        },
      },
    ],
  },
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all',
      minSize: 10000,
      maxSize: 250000,
    },
    minimize:false,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(/* { /* cleanStaleWebpackAssets: false /} */),
    new MiniCssExtractPlugin({
      filename: 'css/[name][hash].css',
      chunkFilename: 'css/[id][hash].css',
    }),
    new HTML({
      template: 'index.html',
      minify: isProduction,
    }),

    new CopyPlugin({
      patterns: [{ from: 'assets', to :'src/assets'  }/* , { from: 'favicon.ico' } */],
    }),
    new webpack.DefinePlugin({
      isDevelopment: isDevelopment,
      isProduction: isProduction,
    }),
  ],
  /* devServer: {
    overlay: true,
    proxy: {
      '**': {
        target: 'http://php1/',
        secure: false,
        changeOrigin: true,
      },
    },
  }, */
}

module.exports = (env, argv) => {
  conf.devtool = argv.mode === 'production' ? false : 'eval-cheap-module-source-map'
  return conf
}
