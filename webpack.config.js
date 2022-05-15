const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    console.log('Goal:', env.goal);
    console.log('Production:', env.production);

    return {
        mode: 'development',
        entry: {
            // The same as it was in optimization, but it gives you control which
            // dependencies to put in vendor
            index: {
                import: './src/index.js',
                dependOn: 'vendor'
            },
            vendor: ['react', 'react-dom']
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
    }
}

// Main bundle - 10 KiB
// Vendors - 1.65 MiB