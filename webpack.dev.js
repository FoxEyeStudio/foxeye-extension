const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const reloadServer = require('./plugins/ReloadPlugin');
const CompilerEmit = require('./plugins/CompilerEmit');

module.exports = merge(config, {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new CompilerEmit()
    ],
    devServer: {
        lazy: false,
        writeToDisk: true,
        before(app) {
            reloadServer(app);
        }
    }
});
