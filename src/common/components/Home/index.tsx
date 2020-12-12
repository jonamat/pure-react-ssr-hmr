import React, { FC } from 'react';

import tests from './tests';

const clientEnv = typeof window !== 'undefined';

const Home: FC = () => {
    return (
        <>
            <h1>React SSR Typescript template</h1>
            <hr />
            <p>
                Preconfigured template to develop SSR React apps in Typescript. It provides several features to speeding
                up your development workflow, using webpack hot modules replacement to track file changes. It also
                provides some tools to deal with the most popular developing practices, such as SCSS transpilation,
                static resources importing, code linting and more. The preconfigured Express server app provides runtime
                compression and minification, EJS rendering, optimizations according to the target environment and more.
            </p>
            <h3>Features</h3>
            <ul>
                <li>Server and client changes watching</li>
                <li>Ready Express app, optimized according to the target environment</li>
                <li>Ready routing system</li>
                <li>Configuration file to customize the app build and behavior</li>
                <li>ESlint and prettier linting</li>
                <li>Portable server bundle (run it without external modules)</li>
                <li>SCSS and CSS support to create stylesheets or inject styles as style tag</li>
                <li>Inline SVG injection</li>
                <li>Links images to relative URLs by importing them as modules directly into your code</li>
                <li>Runtime minification and compression</li>
                <li>Hashed output file names for static resources to optimize caching</li>
                <li>Generates the client bundle dependency graph</li>
            </ul>
            <h3>Usage</h3>
            <p>
                This template is ready to use. Delete the content of /src/common/ and start to write your own app.
                Export a wrapper component as default export in your /src/common/index.tsx. Use&nbsp;
                <code>npm run start</code> to run the develompent server. Use <code>npm run build</code> to build your
                app, put the content of the generated /build/ directory in your target machine and run with&nbsp;
                <code>node ./server</code>.
            </p>
            <h3 id="configuration">Configuration</h3>
            <p>
                The <code>config.js</code> provides some shared variables to quickly configure the app build and server
                behaviors.
            </p>
            <table className="docs">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Default</td>
                        <td>Description</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <code>publicPath</code>
                        </td>
                        <td>
                            <code>/public</code>
                        </td>
                        <td>
                            Static content path. This content will be copied in <code>/staticDirname/</code> with the
                            other client resources.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>staticDirname</code>
                        </td>
                        <td>
                            <code>&quot;static&quot;</code>
                        </td>
                        <td>Directory name for static resources in the production build</td>
                    </tr>
                    <tr>
                        <td>
                            <code>fileLoaderRegex</code>
                        </td>
                        <td>
                            <code>/\.(png|jpe?g|gif|webp)$/i</code>
                        </td>
                        <td>
                            Extensions of the static resources, injected as relative URL into the client bundle. You can
                            import them directly as modules into your project. NOTE: SVGs will be embedded with the svg
                            tag
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>injectStyles</code>
                        </td>
                        <td>
                            <code>false</code>
                        </td>
                        <td>
                            Define how client will fetch the styles. Set true to inject styles in style tag, or false to
                            link the CSS stylesheet in the html header
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>serverViewsPath</code>
                        </td>
                        <td>
                            <code>/src/server/views</code>
                        </td>
                        <td>Path for the ejs templates</td>
                    </tr>
                    <tr>
                        <td>
                            <code>devServerPort</code>
                        </td>
                        <td>
                            <code>3000</code>
                        </td>
                        <td>Server port in development mode</td>
                    </tr>
                    <tr>
                        <td>
                            <code>clientDevServerPort</code>
                        </td>
                        <td>
                            <code>3100</code>
                        </td>
                        <td>
                            Webpack-dev-server port for the client dev bundle. It must be different from devServerPort
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>devBuildPath</code>
                        </td>
                        <td>%TEMP% or /var/tmp + &quot;name&quot; from package.json</td>
                        <td>Path for the development build</td>
                    </tr>
                    <tr>
                        <td>
                            <code>devServerAddress</code>
                        </td>
                        <td>
                            <code>localhost</code>
                        </td>
                        <td>Dev server address, change it only if you are working remotely without tunneling</td>
                    </tr>
                    <tr>
                        <td>
                            <code>openBrowser</code>
                        </td>
                        <td>
                            <code>true</code>
                        </td>
                        <td>Open browser on start</td>
                    </tr>
                    <tr>
                        <td>
                            <code>serverPort</code>
                        </td>
                        <td>
                            <code>80</code>
                        </td>
                        <td>
                            Server port in production mode. You can override it by passing the port number as the first
                            argument
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>bundleExternals</code>
                        </td>
                        <td>
                            <code>true</code>
                        </td>
                        <td>
                            Bundle all the dependencies required by server. This make the bundle portable but larger. If
                            you want to run the server from the build directory this is not necessary
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>minimizeServerBundle</code>
                        </td>
                        <td>
                            <code>false</code>
                        </td>
                        <td>
                            Minimize the server bundle. This is generally not necessary. Set true if you want to save
                            storage memory
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>generateBundleGraph</code>
                        </td>
                        <td>
                            <code>true</code>
                        </td>
                        <td>Generate a visual graph of the client bundled dependencies</td>
                    </tr>
                    <tr>
                        <td>
                            <code>statisticsDirname</code>
                        </td>
                        <td>
                            <code>&quot;client_build_stats&quot;</code>
                        </td>
                        <td>Statistics directory name for the files of the client production bundle graph</td>
                    </tr>
                </tbody>
            </table>
            <h3>Limitations</h3>
            <p>
                If you need to execute a script that can be only executed from client side (fetch data from local
                storage, access to <code>window</code> or <code>document</code> object etc) which will affect the DOM,
                you have to dinamically change the behavior of your code according to the environment. This will throw a
                warning from React, which will complain about the differences between the server rendered DOM and the
                calculeted one by client. To suppress this warning you can add a
                <code>suppressHydrationWarning=&#123;true&#125;</code> in your affected JSX tag.
            </p>
            <h3>Tests</h3>
            <table className="tests-table">
                <thead>
                    <tr>
                        <td>Tested feature</td>
                        <td>Result</td>
                        <td>Info</td>
                    </tr>
                </thead>
                <tbody suppressHydrationWarning={true}>
                    {clientEnv && tests.map((Test, index) => <Test key={index} />)}
                </tbody>
            </table>
            <h3>Compatibility</h3>
            <ul>
                <li>Node &#62;&#61;12</li>
                <li>Webpack &#62;&#61;5</li>
                <li>Express &#62;&#61;4</li>
            </ul>
            <h3>Links and credits</h3>
            Repository:&nbsp;
            <a href="https://github.com/jonamat/pure-react-ssr-hmr">https://github.com/jonamat/pure-react-ssr-hmr</a>
            <br />
            Demo site: <a href="http://pure-react-ssr-hmr.tk">http://pure-react-ssr-hmr.tk</a>
            <br />
            Real usage: <a href="#">In progress</a>
            <br />
            Inspiration: <a href="https://github.com/yusinto/universal-hot-reload">yusinto/universal-hot-reload</a>
            <br />
            Why you should render React on the server side:&nbsp;
            <a href="https://blog.logrocket.com/why-you-should-render-react-on-the-server-side-a50507163b79/">
                Link to the article
            </a>
            <h3>Licence</h3>
            <p>MIT @ Jonathan Mataloni</p>
        </>
    );
};

export default Home;
