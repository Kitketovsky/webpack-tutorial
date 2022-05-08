const path = require('path');

// The SplitChunksPlugin allows us to extract common dependencies into an existing entry chunk or an entirely new chunk.

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        another: './src/another-module.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}