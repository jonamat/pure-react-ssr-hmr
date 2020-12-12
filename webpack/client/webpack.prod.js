const path = require('path');
const merge = require('webpack-merge').merge;
const Visualizer = require('webpack-visualizer-plugin2');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const webpack = require('webpack');
const dotenv = require('dotenv');

const common = require('./webpack.common');

const { staticDirname, fileLoaderRegex, statisticsDirname, generateBundleStatistics } = require('../../config');

const rules = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                comments: true, // Preserve webpack config comments
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
    {
        test: fileLoaderRegex,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',

                // Resources will be copied in /staticDirname by server compiler
                emitFile: false,
            },
        },
    },
];

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '..', '..', 'build', staticDirname),
        filename: 'bundle.[hash].js',
    },
    module: { rules },
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

        // Generate bundle statistics
        ...(generateBundleStatistics
            ? [
                  new StatsWriterPlugin({
                      filename: path.join('..', '..', statisticsDirname, 'log.json'),
                      fields: null,
                      stats: { chunkModules: true },
                  }),
                  new Visualizer({
                      filename: path.join('..', '..', statisticsDirname, 'webpack.statistics.html'),
                  }),
              ]
            : []),
    ],
});
