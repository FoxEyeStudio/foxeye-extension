const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: './src/popup',
        content: './src/content/index.js',
        background: './src/background/index.js',
        foxeyeProxy: './src/proxy/index.js',
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
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'static/[name]-[hash].[ext]'
                    }
                }
                ]
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
                { from: "public/images", to: 'images', force: true},
                { from: "public/icons", to: 'icons', force: true}
            ],
        })
    ],
};

//1: babel is a tool that transform jsx into js code that webapck can understand.
