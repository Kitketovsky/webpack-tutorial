const path = require('path');

// Code splitting is one of the most compelling features of webpack.
// This feature allows you to split your code into various bundles which can
// then be loaded on demand or in parallel. It can be used to achieve smaller
// bundles and control resource load prioritization which, if used correctly,
// can have a major impact on load time.

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
    },
}