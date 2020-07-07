const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');

const htmlFiles = fs
  .readdirSync(path.join(__dirname, 'src'))
  .filter(file => file.includes('.html'));

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: { publicPath: '/', path: path.join(__dirname, 'dist') },
  plugins: [
    ...htmlFiles.map(
      htmlFile =>
        new HtmlWebpackPlugin({
          filename: path.join(__dirname, 'dist/' + htmlFile),
          template: path.join(__dirname, 'src/' + htmlFile),
        })
    ),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
  ],
  module: {
    rules: [
      { test: /\.obj$/, loader: 'webpack-obj-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] },
        },
      },
      { test: /\.glsl$/, loader: 'webpack-glsl-loader' },
      {
        test: /\.(sc|c)ss$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpe?g)$/,
        loader: 'url-loader',
      },
    ],
  },
};
