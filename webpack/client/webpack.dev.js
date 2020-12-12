const merge = require('webpack-merge').merge;
const webpack = require('webpack');
const dotenv = require('dotenv');

const common = require('./webpack.common');
const { clientDevServerPort, devBuildPath, devServerAddress, staticDirname, fileLoaderRegex } = require('../../config');

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
                    'babel-plugin-typescript-to-proptypes', // Generates PropTypes from Typescript types
                    '@babel/transform-runtime',
                ],
                cacheDirectory: true,
            },
        },
    },
    {
        test: fileLoaderRegex,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',

                // Resources will be copied in /staticDirname by server compiler
                emitFile: false,
                outputPath: staticDirname,
                publicPath: '.',
            },
        },
    },
];

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: devBuildPath,
        filename: 'dev.bundle.js',
        publicPath: `http://${devServerAddress}:${clientDevServerPort}/`,
    },
    plugins: [
        // Override process.env with custom vars defined in .env
        new webpack.DefinePlugin(
            Object.fromEntries(
                Object.entries({
                    NODE_ENV: 'development',

                    ...dotenv.config().parsed,
                }).map((pair) => ['process.env.' + pair[0], JSON.stringify(pair[1])]),
            ),
        ),
    ],
    module: { rules },
});
