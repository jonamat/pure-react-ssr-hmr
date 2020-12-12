const path = require('path');
const { injectStyles } = require('../../config');

const rules = [
    {
        test: /\.woff2$/i,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',

                // Resources will be copied in /staticDirname by server compiler
                emitFile: false,
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
        // If styles will be served separately, the server will extract them to create the stylesheet to link on request
        use: injectStyles
            ? [
                  'style-loader',
                  'css-loader',
                  {
                      loader: 'sass-loader',
                      options: {
                          sourceMap: true,
                      },
                  },
              ]
            : ['null-loader'],
    },
    {
        test: /\.css$/,
        use: injectStyles ? ['style-loader', 'css-loader'] : ['null-loader'],
    },
];

module.exports = {
    entry: [path.resolve(__dirname, '..', '..', 'src', 'client', 'index.tsx')],
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    module: { rules },
};
