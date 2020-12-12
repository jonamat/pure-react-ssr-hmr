'use strict';

const path = require('path');
const fs = require('fs');
const vm = require('vm');
const nodeModule = require('module');
const opn = require('opn');
const url = require('url');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const clearRequireCache = require('clear-require');
require('colors');

const serverConfig = require('../webpack/server/webpack.dev.js');
const clientConfig = require('../webpack/client/webpack.dev.js');
const { devServerAddress, devServerPort, devBuildPath, openBrowser } = require('../config');

// Clean dev build path
fs.rmdirSync(devBuildPath, { recursive: true });

const initHttpServer = (serverBundlePath) => {
    try {
        /**
         * Server dev bundle is bundled without external modules to speed up the recompilation.
         * If it's executed outside the project directory (eg temp directory), it can't reach them.
         * Read the server script and execute it from here to use the project context.
         */
        var serverScript = fs.readFileSync(serverBundlePath);
        vm.runInThisContext(nodeModule.wrap(serverScript))(exports, require, module, __filename, devBuildPath);

        // Import the http server instance
        const httpServer = module.exports.default;

        const sockets = new Map();
        let nextSocketId = 0;

        httpServer.on('connection', (socket) => {
            const socketId = nextSocketId++;
            sockets.set(socketId, socket);

            socket.on('close', () => {
                sockets.delete(socketId);
            });
        });

        return { httpServer, sockets };
    } catch (error) {
        console.log(`Server initialization failed - ${new Date()}\n${error.message}\n${error.stack}`.red);
    }
};

// Check and log errors and warnings
const checkStats = (error, stats) => {
    if (error) {
        console.error(`Server bundling error - ${new Date()}\n${error.message}\n${error.stack}`.red);

        if (error.details) {
            console.log(error.details.red);
        }
        return true;
    }

    if (stats.hasErrors()) {
        console.log(stats.toJson().errors.red);
    }

    if (stats.hasWarnings()) {
        console.log(stats.toJson().warnings.yellow);
    }
};

/**
 * Watch client changes
 */
const clonedClientConfig = { ...clientConfig };
const {
    devServer = {},
    output: { publicPath },
} = clonedClientConfig;
const { protocol, host, port } = url.parse(publicPath);
const webpackDevServerUrl = `${protocol}//${host}`;

const devServerOptions = {
    quiet: true,
    noInfo: true,
    lazy: false,
    publicPath,
    stats: 'errors-only',
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    hot: true,
    sockPort: port,
    ...devServer,
};

webpackDevServer.addDevServerEntrypoints(clonedClientConfig, devServerOptions);
const compiler = webpack(clonedClientConfig);

const devServerInstance = new webpackDevServer(compiler, devServerOptions);
devServerInstance.listen(port, devServerAddress, () => {
    console.log(`Starting webpack-dev-server on ${webpackDevServerUrl}`.cyan);
});

/**
 * Watch server changes
 */
let initialLoad = true;
let httpServerInitObject; // contains the httpServer itself and socket references

const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);

const compilerOptions = {
    aggregateTimeout: 500, // wait so long for more changes
    poll: true, // use polling instead of native watchers
};

// Compile server
const serverCompiler = webpack(serverConfig, (error, stats) => {
    if (checkStats(error, stats)) return;

    // Watch server file changes
    serverCompiler.watch(compilerOptions, (error, stats) => {
        if (checkStats(error, stats)) return;

        clearRequireCache(bundlePath);

        if (!initialLoad) {
            httpServerInitObject.httpServer.close(() => {
                httpServerInitObject = initHttpServer(bundlePath);

                if (httpServerInitObject) {
                    initialLoad = false;
                    console.log(`Server restarted successfully - ${new Date()}`.green);
                } else {
                    // Server bundling error has occurred
                    initialLoad = true;
                }
            });

            // Destroy all open sockets
            for (const socket of httpServerInitObject.sockets.values()) {
                socket.destroy();
            }
        } else {
            httpServerInitObject = initHttpServer(bundlePath);

            if (httpServerInitObject) {
                initialLoad = false;
                console.log('Server bundled successfully'.green);
            } else {
                // Server bundling error has occurred
                initialLoad = true;
            }
        }
    });

    // Open browser on start
    if (openBrowser) opn(`http://${devServerAddress}:${devServerPort}`);
});
