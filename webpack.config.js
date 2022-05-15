const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    console.log('Goal:', env.goal);
    console.log('Production:', env.production);

    return {
        mode: 'development',
        devtool: "eval-cheap-module-source-map",
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
        // Certain utilities, plugins, and loaders only make sense when building
        // for production. For example, it usually doesn't make sense to minify and mangle your
        // code with the TerserPlugin while in development. These tools should
        // typically be excluded in development:

        // TerserPlugin
        // [fullhash]/[chunkhash]/[contenthash]
        // AggressiveSplittingPlugin
        // AggressiveMergingPlugin
        // ModuleConcatenationPlugin
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: '/',
            // Webpack has the ability to generate path info in the output bundle.
            // However, this puts garbage collection pressure on projects that
            // bundle thousands of modules. Turn this off in the options.output.pathinfo setting:
            pathinfo: false
        },
        optimization: {
            runtimeChunk: 'single',
        // Webpack does extra algorithmic work to optimize
        // the output for size and load performance.
        // These optimizations are performant for smaller codebases,
        // but can be costly in larger ones:
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false
        }
    }
}

// Main bundle - 10 KiB
// Vendors - 1.65 MiB