const path = require('path');
const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const dotenv = require('dotenv');
const webpackNodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common');
const { staticDirname, serverPort, injectStyles, minimizeServerBundle } = require('../../config');

const rules = [
    {
        test: /\.tsx?$/,
        use: {
            loader: 'babel-loader',
            options: {
                comments: true, // Preserve webpack magic comments
                sourceMaps: false,
                presets: ['@babel/preset-env', '@babel/react', '@babel/typescript'],
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
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '..', '..', 'build'),
        filename: 'server.js',
    },
    optimization: {
        minimize: minimizeServerBundle,
    },
    externalsPresets: {
        node: true,
    },
    externals: [...(minimizeServerBundle ? [webpackNodeExternals()] : [])],
    module: { rules },
    plugins: [
        // Override process.env with custom vars defined in .env
        new webpack.DefinePlugin(
            Object.fromEntries(
                Object.entries({
                    NODE_ENV: 'production',
                    STATIC_DIRNAME: staticDirname,
                    SERVER_PORT: serverPort,
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
                      filename: path.join(staticDirname, 'style.[hash].css'),
                  }),
              ]),
    ],
});
