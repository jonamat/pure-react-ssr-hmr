const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ESLintPlugin = require('eslint-webpack-plugin');

const { staticDirname, fileLoaderRegex, publicPath, serverViewsPath, injectStyles } = require('../../config');

const rules = [
    {
        test: fileLoaderRegex,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',

                // Resources will be copied in /staticDirname
                // Set Express static middleware to point to /staticDirname
                outputPath: staticDirname,
                publicPath: '.',
            },
        },
    },
    {
        test: /\.woff2$/i,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',

                // Resources will be copied in /staticDirname
                // Set Express static middleware to point to /staticDirname
                outputPath: staticDirname,
                publicPath: '.',
            },
        },
    },
    {
        test: /\.svg$/,
        use: {
            loader: 'react-svg-loader',
            options: {
                svgo: {
                    // Preserve IDs to create tageted CSS selectors
                    plugins: [{ cleanupIDs: false }],
                },
            },
        },
    },
    {
        test: /\.s[ac]ss$/,
        use: [
            // Inject styles on client bundle evalutation or generate stylesheet
            ...(injectStyles ? [] : [MiniCssExtractPlugin.loader]),

            'css-loader',
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                },
            },
        ],
    },
    {
        test: /\.css$/,
        use: [...(injectStyles ? [] : [MiniCssExtractPlugin.loader]), 'css-loader'],
    },
];

module.exports = {
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: [path.resolve(__dirname, '..', '..', 'src', 'server', 'server.tsx')],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
        // Linting
        /**
         * Open issue on https://stackoverflow.com/questions/65234026/eslint-webpack-plugin-does-not-emit-warnings-or-errors
         * ESLintPlugin currently seems not emit warnings or errors. Avoid the plugin exec for now.
         * To lint the code, use npm run lint
         */
        // new ESLintPlugin({
        //     context: 'src',
        //     extensions: ['ts', 'tsx'],
        //     lintDirtyModulesOnly: true,
        //     emitError: true,
        //     emitWarning: true,
        // }),


        // Copy static files in /staticDirname
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: serverViewsPath,
                    to: 'views',
                },
                {
                    from: publicPath,
                    to: staticDirname,
                },
            ],
        }),
    ],
    module: { rules },
};
