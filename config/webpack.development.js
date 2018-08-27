const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FontminPlugin = require('fontmin-webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const srcDir = path.resolve(__dirname, '..', 'src');
const distDir = path.resolve(__dirname, '../', 'dist');
const staticDir = path.resolve(__dirname, '../', 'dist');
const {
    NODE_ENV = 'development'
} = process.env;

const extractSass = new ExtractTextPlugin({
    filename: "assets/css/main.css"
});

module.exports = {
    context: srcDir,
    devtool: 'source-map',

    entry: [
        '../src/index.js'
    ],

    output: {
        filename: 'assets/js/main.js',
        path: distDir,
        publicPath: '/', //http://localhost:3073/
        sourceMapFilename: 'assets/js/main.map'
    },

    devServer: {
        contentBase: srcDir,
        publicPath: '/',
        historyApiFallback: true,
        host: '0.0.0.0', // can be overwritten by process.env.HOST
        disableHostCheck: true,
        port: 3073
    },
    watchOptions: {
        poll: true
    },

    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                },
                exclude: path.resolve(__dirname, "./node_modules"),
                include: srcDir
            },
            {
                test: /\.s?css$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true
                        }
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                }),
                exclude: path.resolve(__dirname, "./node_modules"),
                include: srcDir
            },
            {
                test: /\.(eot?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
                use: 'file-loader?name=[name].[ext]&outputPath=assets/fonts/'
            },
            {
                test: /\.(ico)$/,
                use: [
                    'url-loader?limit=21000&name=assets/img/[name].[ext]'
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp4)$/,
                use: [
                    'file-loader?name=[name].[ext]&outputPath=assets/img/'
                ]
            },
            {
                test: /\.(svg)$/,
                use: [
                    'file-loader?name=[name].[ext]&outputPath=assets/img/svg/'
                ]
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            },
            'NODE_ENV': NODE_ENV,
            '__DEV__': NODE_ENV === 'development',
            '__PROD__': NODE_ENV === 'production'
        }),
        new HtmlWebpackPlugin({
            template: path.join(srcDir, 'index.html'),
            path: distDir,
            filename: 'index.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            tether: 'tether',
            Tether: 'tether',
            'window.Tether': 'tether',
        }),
        new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),
        extractSass,
    ]
};
