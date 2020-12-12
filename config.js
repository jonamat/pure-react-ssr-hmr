const path = require('path');
const os = require('os');
const package = require('./package.json');

module.exports = {
    // Static contents path. These contents will be copied in <code>/staticDirname/</code> with the other client resources
    publicPath: path.resolve(__dirname, 'public'),

    // Assets folder name for static files in production build
    staticDirname: 'static',

    // Extensions of the static resources, injected as relative URL into the client bundle. You can import them directly as modules into your project. NOTE: SVGs will be embedded as <svg> tag
    fileLoaderRegex: /\.(png|jpe?g|gif|webp)$/i,

    // Define how client will fetch the styles. Set true to inject styles in {'<style>'} tag, or false to add a link to the CSS stylesheet in the html header
    injectStyles: false,

    // Path for the ejs templates
    serverViewsPath: path.resolve(__dirname, 'src', 'server', 'views'),

    // Server port in development
    devServerPort: 3000,

    // webpack-dev-server port for the client development bundle. It must be different from devServerPort
    clientDevServerPort: 3100,

    // Path for the development bundles
    devBuildPath: path.resolve(os.tmpdir(), package.name),

    // Dev server address, change it only if you work from an other machine
    devServerAddress: 'localhost',

    // Open browser on devmode start
    openBrowser: true,

    // Server port in production mode. You can override it by passing the port number as the first argument
    serverPort: 80,

    // Bundle all the dependencies required by server. This make the bundle portable but larger. If you want to run the server from the build directory this is not necessary
    bundleExternals: true,

    // Minimize the server bundle. This is generally not necessary. Set true if you want to save storage memory
    minimizeServerBundle: false,

    // Generate a visual graph of the client bundled dependencies
    generateBundleGraph: true,

    // Statistics directory name for the files of the client production bundle graph
    statisticsDirname: 'client_build_stats',
};
