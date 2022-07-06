const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/index.js',
    content: './src/content/index.js',
    background: './src/background/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader', //*1
            options:{
                presets: ['@babel/preset-env', '@babel/preset-react'],
            }
        }
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"]
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'popup.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "public/manifest.json" },
        { from: "public/images",
          to: 'images',
          force: true}
      ],
    }),
  ],
};

//1: babel is a tool that transform jsx into js code that webapck can understand.
