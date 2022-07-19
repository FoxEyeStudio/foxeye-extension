const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const rootDir = path.resolve(__dirname, '');

module.exports = {
    entry: {
        popup: './src/popup',
        content: './src/content/index.js',
        background: './src/background/index.js',
        foxeyeProxy: './src/proxy/index.js',
    },
    output: {
        path: path.resolve(rootDir, './dist/js'),
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
            template: path.resolve(rootDir, 'public/index.html'),
            filename: path.resolve(rootDir, 'dist/html/popup.html'),
            chunks: ['popup']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(rootDir, 'public/manifest.json'),
                    to: path.resolve(rootDir, 'dist/manifest.json')
                },
                {
                    from: path.resolve(rootDir, 'public/images'),
                    to: path.resolve(rootDir, 'dist/images')
                },
                {
                    from: path.resolve(rootDir, 'public/icons'),
                    to: path.resolve(rootDir, 'dist/icons')
                },

                {
                    from: path.resolve(rootDir, 'src/css/content.css'),
                    to: path.resolve(rootDir, 'dist/css/foxeye-chrome-extension-content.css')
                },

                // { from: "src/css/content.css", to: 'dist/css/foxeye-chrome-extension-content.css', force: true}
            ],
        })
    ],
};
