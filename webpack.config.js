const path = require('path');

// The SplitChunksPlugin allows us to extract common dependencies into an existing entry chunk or an entirely new chunk.

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        another: './src/another-module.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
    //With the optimization.splitChunks configuration option in place,
    // we should now see the duplicate dependency removed from our index.bundle.js
    // and another.bundle.js. The plugin should notice that we've separated lodash
    // out to a separate chunk and remove the dead weight from our main bundle.
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}