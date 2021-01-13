const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  style: './src/scss/style.scss',
  bundle: './src/app.js'
}

const PAGES_DIR = './src/pug/pages/'
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  mode: 'development',
  entry: {
      ...PATHS
  },
  devtool: 'inline-source-map',
    devServer: {
      index: 'index.html',
      contentBase: path.join(__dirname, 'dist'),
      hot: true,
      writeToDisk: true,
      open: 'chrome',
      compress: true,
      port: 9000
    },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'js/[name][hash].[ext]'
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {pretty: true},
        exclude: '/node_modules/',
      },
      {
          test: /\.css$/i,
          use: [
              'style-loader',
          ],
          exclude: '/node_modules/',
      },
      {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'file-loader',
                  options: {outputPath: 'css/', name: '[name].css'}
              },
              'sass-loader'
          ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
    ...PAGES.map(page => new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`,
        filename: `./${page.replace(/\.pug/, '.html')}`
    })),
  ]
};