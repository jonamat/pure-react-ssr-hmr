import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { StaticRouterContext } from 'react-router';
import fetch from 'cross-fetch';

import Wrapper from '../common';
import initServer from './initServer';

const { app, port } = initServer();

// Fetch data on server for the demo tests
app.use('^/$', async (req, res, next) => {
    let countryName;
    try {
        countryName = (await (await fetch('https://json.geoiplookup.io')).json()).country_name;
    } catch (error) {
        console.error(error);
    }

    res.locals.data = { countryName };
    next();
});

// Render the main view and inject the React app
app.get('^/*', (req, res) => {
    const context: StaticRouterContext = {};

    const content = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <Wrapper />
        </StaticRouter>,
    );

    if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        res.redirect(301, context.url);
    } else {
        res.render('index', { content });
    }
});

// Open http server
export default app.listen(port, () => {
    console.info(`Node server open on port ${port}.`);
});
