const path = require('path');
const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const dotenv = require('dotenv');
const webpackNodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');
const {
    staticDirname,
    devBuildPath,
    devServerPort,
    devServerAddress,
    clientDevServerPort,
    injectStyles,
} = require('../../config');

const rules = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                comments: true, // Preserve webpack magic comments
                sourceMaps: true,
                presets: ['@babel/env', '@babel/react', '@babel/typescript'],
                plugins: [
                    [
                        '@babel/plugin-proposal-class-properties',
                        {
                            loose: true,
                        },
                    ],
                    '@babel/transform-runtime',
                ],
            },
        },
    },
];

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: devBuildPath,
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    externals: [webpackNodeExternals()],
    externalsPresets: {
        node: true,
    },
    module: { rules },
    plugins: [
        // Override process.env with custom vars defined in .env
        new webpack.DefinePlugin(
            Object.fromEntries(
                Object.entries({
                    NODE_ENV: 'development',
                    STATIC_DIRNAME: staticDirname,
                    DEV_SERVER_PORT: devServerPort,
                    DEV_SERVER_ADDRESS: devServerAddress,
                    HMR_SERVER_PORT: clientDevServerPort,
                    INJECT_STYLES: injectStyles,

                    ...dotenv.config().parsed,
                }).map((pair) => ['process.env.' + pair[0], JSON.stringify(pair[1])]),
            ),
        ),

        // Extract styles
        ...(injectStyles
            ? []
            : [
                  new MiniCssExtractPlugin({
                      filename: path.join(staticDirname, 'style.css'),
                  }),
              ]),
    ],
});
