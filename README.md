# pure-react-ssr-hmr

Demo site: [http://pure-react-ssr-hmr.tk](http://pure-react-ssr-hmr.tk)

Preconfigured template to develop SSR React apps in Typescript. It provides several features to speeding up your development workflow, using webpack hot modules replacement to track file changes. It also provides some tools to deal with the most popular developing practices, such as SCSS transpilation, static resources importing, code linting and more. The preconfigured Express server app provides runtime compression and minification, EJS rendering, optimizations according to the target environment and more.

## Features

- Server and client changes watching
- Ready Express app, optimized according to the target environment
- Ready routing system
- Configuration file to customize the app build and behavior
- ESlint and prettier linting
- Portable server bundle (run it without external modules)
- SCSS and CSS support to create stylesheets or inject styles as <style> tag (see Configuration)
- Inline SVG injection
- Links images to relative URLs by importing them as modules directly into your code
- Runtime minification and compression
- Hashed output file names for static resources to optimize caching
- Generates the client bundle dependency graph

## Usage

This template is ready to use. Delete the content of /src/common/ and start to write your own app. Export a wrapper component as default export in your /src/common/index.tsx. Use npm run start to run the develompent server. Use npm run build to build your app, put the content of the generated /build/ directory in your target machine and run with node ./server.

## Configuration
The config.js provides some shared variables to quickly configure the app build and server behaviors.

| Name                                                | Default                          | Description                                                                                                                                                                                      |
| :-------------------------------------------------- | :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `publicPath`                                        | `/public	`                       | Static content path. This content will be copied                                                                                                                                                 |
| in /staticDirname/ with the other client resources. |
| `staticDirname`                                     | `"static"`                       | Directory name for static resources in the production build                                                                                                                                      |
| `fileLoaderRegex`                                   | `/\.(png|jpe?g|gif|webp)$/i`     | Extensions of the static resources, injected as relative URL into the client bundle. You can import them directly as modules into your project. NOTE: SVGs will be embedded with the `<svg>` tag |
| `injectStyles`                                      | `false`                          | Define how client will fetch the styles. Set true to inject styles in `<style>` tag, or false to link the CSS stylesheet in the html header                                                      |
| `serverViewsPath`                                   | `/src/server/views`              | Path for the ejs templates                                                                                                                                                                       |
| `devServerPort`                                     | `3000`                           | Server port in development mode                                                                                                                                                                  |
| `clientDevServerPort`                               | `3100`                           | Webpack-dev-server port for the client dev bundle. It must be different from devServerPort                                                                                                       |
| `devBuildPath`                                      | %TEMP% or/var/tmp + package.name | Path for the development build                                                                                                                                                                   |
| `devServerAddress`                                  | `localhost`                      | Dev server address, change it only if you are working remotely without tunneling                                                                                                                 |
| `openBrowser`                                       | `true`                           | Open browser on start                                                                                                                                                                            |
| `serverPort`                                        | `80`                             | Server port in production mode. You can override it by passing the port number as the first                                                                                                      |
| argument                                            |
| `bundleExternals`                                   | `true`                           | Bundle all the dependencies required by server. This make the bundle portable but larger. If you want to run the server from the build directory this is not necessary                           |
| `minimizeServerBundle`                              | `false`                          | Minimize the server bundle. This is generally not necessary. Set true if you want to save storage memory                                                                                         |
| `generateBundleGraph`                               | `true`                           | Generate a visual graph of the client bundled dependencies                                                                                                                                       |
| `statisticsDirname`                                 | `"client_build_stats"`           | Statistics directory name for the files of the client production bundle graph                                                                                                                    |

## Limitations

If you need to execute a script that can be only executed from client side (fetch data from local storage, access to window or document object etc) which will affect the DOM, you have to dinamically change the behavior of your code according to the environment. This will throw a warning from React, which will complain about the differences between the server rendered DOM and the calculeted one by client. To suppress this warning you can add a suppressHydrationWarning={true} in your affected JSX tag.

## Compatibility
- Node >= 12
- Webpack >= 5
- Express >= 4

## Links and credits
Repository: [https://github.com/jonamat/pure-react-ssr-hmr](https://github.com/jonamat/pure-react-ssr-hmr)
Demo site: [http://pure-react-ssr-hmr.tk](http://pure-react-ssr-hmr.tk)
Real usage: [In progress](#)
Why you should render React on the server side: [Link to the article](https://blog.logrocket.com/why-you-should-render-react-on-the-server-side-a50507163b79/#:~:text=SSR%20means%20there%20is%20no,SSR%20approach%20for%20their%20sites.)
Inspiration: [yusinto/universal-hot-reload](https://github.com/yusinto/universal-hot-reload)

## Licence
MIT @ Jonathan Mataloni
