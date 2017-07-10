/**
 * Created by flylxq on 06/07/2017.
 */
// import * as webpack from 'webpack';
// import * as path from 'path';

const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
    context: path.join(__dirname, 'public'),
    entry: {
        client: ['./javascripts/client/Client.tsx'],
        login: ['./javascripts/main/Login.tsx'],
        index: ['./javascripts/main/index.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'public/dist/'),
        filename: '[name].production.js'
    },
    // Currently we need to add '.ts' to the resolve.extensions array.
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.jsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015'],
                    plugins: [
                        'transform-class-properties',
                        "transform-object-assign"
                    ]
                }
            }
        },{
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015'],
                    plugins: [
                        'transform-class-properties',
                        "transform-object-assign"
                    ]
                }
            }, {
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig.json'
                }
            }]
        },{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    plugins: [
        // new UglifyJSPlugin()
    ]
}

module.exports = config;
