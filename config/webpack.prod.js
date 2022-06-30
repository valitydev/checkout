const webpack = require('webpack');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const checkoutConfig = require('./checkout-config');
const initializerConfig = require('./initializer-config');
const samsungPayConfig = require('./samsung-pay-config');
const prepareOutputConfig = require('./prepare-output-config');
const commonConfig = require('./common-config');

const commonProdConfig = {
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled'
        })
    ]
};

const baseOutput = 'dist';

const prepareModule = (env, baseConfig, outputPath, jsPattern, cssPattern) =>
    merge(baseConfig, commonConfig(env), prepareOutputConfig(outputPath, jsPattern, cssPattern), commonProdConfig);

module.exports = (env, { mode }) => [
    prepareModule(mode, checkoutConfig, `${baseOutput}/v1`, '[name].[hash:20]', '[hash:20]'),
    prepareModule(mode, samsungPayConfig, `${baseOutput}/v1`, '[name].[hash:20]', '[hash:20]'),
    prepareModule(mode, initializerConfig, baseOutput)
];
