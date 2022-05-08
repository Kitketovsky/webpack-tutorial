const path = require('path');

module.exports = {
    mode: 'development',
    // If there are any duplicated modules (lodash) between entry chunks they will be included in both bundles.
    // It isn't as flexible and can't be used to dynamically split code with the core application logic.
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
}