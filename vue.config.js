const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

module.exports = {
    lintOnSave: false,

    devServer: {
        proxy: 'http://localhost:1234'
    },
    configureWebpack: {
        plugins: [
            new BundleAnalyzerPlugin(
                { analyzerPort: 8889, }
            ),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: ['popper.js', 'default']
            })
        ],
        optimization: {
            splitChunks: { minSize: 0 }
        }
    }
}
