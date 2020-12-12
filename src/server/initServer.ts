import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';
import csp from 'helmet-csp';
import compression from 'compression';
import minifyHtml from 'express-minify-html-terser';

const initServer = () => {
    const {
        STATIC_DIRNAME,
        DEV_SERVER_ADDRESS,
        DEV_SERVER_PORT,
        NODE_ENV,
        HMR_SERVER_PORT,
        INJECT_STYLES,
        SERVER_PORT,
    } = process.env;

    const devMode = NODE_ENV === 'development';
    const port = devMode ? DEV_SERVER_PORT : process.argv[2] || SERVER_PORT;
    const maxAge = devMode ? 0 : 31536000;

    const app = express();

    // Define middleware for static resources
    app.use(express.static(path.resolve(__dirname, STATIC_DIRNAME), { maxAge }));

    // Define template engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.engine('ejs', ejs.renderFile); // ejs must be required to bundle it

    // Define middleware to inject the stylesheet URL in the <link> tag
    if (!INJECT_STYLES) {
        // The stylesheet filename contains a unknown hash, so find it
        const stylesheetFilename = fs
            .readdirSync(path.resolve(__dirname, STATIC_DIRNAME))
            .find((filename) => /^.*style.*\.css$/.test(filename));

        if (!stylesheetFilename)
            throw new Error(`Cannot find the stylesheet in ${path.resolve(__dirname, STATIC_DIRNAME)}`);

        app.use((req, res, next) => {
            const render = res.render;

            // Override the render method to include the var automatically
            res.render = function (
                view: string,
                options?: Record<string, unknown> | ((err: Error, html: string) => void),
                callback?: (err: Error, html: string) => void,
            ) {
                const _render = render.bind(this);

                if (typeof options === 'function') {
                    callback = options;
                    _render(view, { stylesheetFilename }, callback);
                } else _render(view, { stylesheetFilename, ...options }, callback);
            };

            next();
        });
    }

    // Define middleware to inject the client bundle URL in the <script> tag
    const clientBundleFilename = devMode
        ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/dev.bundle.js`
        : fs
              .readdirSync(path.resolve(__dirname, STATIC_DIRNAME))
              .find((filename) => /^.*bundle\..*\.js$/.test(filename));

    if (!clientBundleFilename)
        throw new Error(
            `Cannot find client bundle in ${
                devMode ? `http://${DEV_SERVER_ADDRESS}:${HMR_SERVER_PORT}/` : path.resolve(__dirname, STATIC_DIRNAME)
            }`,
        );

    app.use((req, res, next) => {
        const render = res.render;

        // Override the render method to include the var automatically
        res.render = function (
            view: string,
            options?: Record<string, unknown> | ((err: Error, html: string) => void),
            callback?: (err: Error, html: string) => void,
        ) {
            const _render = render.bind(this);

            if (typeof options === 'function') {
                callback = options;
                _render(view, { clientBundleFilename }, callback);
            } else _render(view, { clientBundleFilename, ...options }, callback);
        };

        next();
    });

    // Define optimizations according to the target environment
    if (devMode) {
        [STATIC_DIRNAME, DEV_SERVER_ADDRESS, DEV_SERVER_PORT, NODE_ENV, HMR_SERVER_PORT].forEach((env) => {
            if (!env) throw new Error(`Env key missed. Check webpack.dev.config`);
        });

        // Set permissive CORS and CSP directives to avoid cross-domain issues with webpack-dev-server
        app.use(cors());
        app.use(
            csp({
                directives: {
                    defaultSrc: [
                        '*',
                        'data:',
                        'blob:',
                        'filesystem:',
                        'about:',
                        'ws:',
                        'wss:',
                        "'unsafe-inline'",
                        "'unsafe-eval'",
                    ],
                },
            }),
        );
    } else {
        [STATIC_DIRNAME, NODE_ENV, SERVER_PORT].forEach((env) => {
            if (!env) throw new Error(`Env key missed. Check webpack.prod.config`);
        });

        // Minify the output on request
        app.use(minifyHtml());

        // Compress the responses.
        // Use this values carefully. Test first your server performance, network speed, amount of requests etc
        app.use(
            compression({
                threshold: 20000,
                level: 9,
                memLevel: 9,
            }),
        );
    }

    return {
        app,
        port,
    };
};

export default initServer;
