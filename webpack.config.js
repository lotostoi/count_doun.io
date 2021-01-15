require('@babel/polyfill')
const path = require('path')
const HTML = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
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
    filename: 'js/countdown.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.scss', '.css', '.json', '.img', 'png'],
    alias: {
      vue: 'vue/dist/vue.js',
      '~': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src'),
      'anim': path.resolve(__dirname, 'src/animations'),
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
          },
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          'css-loader',
          'sass-loader',
        ],

      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, path.resolve(__dirname, 'src/js', 'main.js'), path.resolve(__dirname, 'src/js', 'countdown.js')],
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
              outputPath: 'img/',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
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
  /*   splitChunks: {
      // include all types of chunks
      chunks: 'all',
      minSize: 10000,
      maxSize: 1000000,
    }, */
    minimize: isProduction,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name][hash].css',
      chunkFilename: 'css/[id][hash].css',
    }),
    new HTML({
      template: 'index.html',
      minify: isProduction,
    }),

    // new CopyPlugin({
    // patterns: [{ from: 'assets', to: 'src/assets' } /* , { from: 'favicon.ico' } */],
    // }),
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
