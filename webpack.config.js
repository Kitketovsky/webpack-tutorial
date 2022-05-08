const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// So we're using webpack to bundle our modular application which yields a deployable /dist directory.
// Once the contents of /dist have been deployed to a server, clients (typically browsers) will
// hit that server to grab the site and its assets. The last step can be time consuming, which is why
// browsers use a technique called caching. This allows sites to load faster with less unnecessary
// network traffic. However, it can also cause headaches when you need new code to be picked up.
//
// This guide focuses on the configuration needed to ensure files produced by
// webpack compilation can remain cached unless their content has changed.

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Caching'
        })
    ],
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
}