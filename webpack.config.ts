/**
 * Created by flylxq on 26/06/2017.
 */
import * as webpack from 'webpack';
import * as path from 'path';
declare var __dirname: any;

const config: webpack.Configuration = {
    context: path.join(__dirname, 'pages'),
    entry: {
        login: ['./main/Login.tsx'],
        index: ['./main/index.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'public/dist/'),
        filename: '[name].js'
    },
    devtool: 'inline-source-map',
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
                        'transform-class-properties'
                    ]
                }
            }
        },{
            test: /\.tsx?$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: 'tsconfig.json'
                },
            }
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
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
}

module.exports = config;
