const path = require('path');

// If you are using TypeScript, make sure to set compilerOptions.module
// to esnext or es2020 for code splitting to work correctly.

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/',
        chunkFilename: 'chunk.[hash:8].js', // id === src_lazy_js
    },
}