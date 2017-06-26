/**
 * Created by xiaoqing.liu on 2016/1/31.
 */
var path = require('path');

module.exports = {
    context: path.join(__dirname, 'public'),
    entry: {
        Client: ['./javascripts/client/Client.jsx'],
        login: ['./javascripts/main/Login.jsx'],
        index: ['./javascripts/main/index.jsx']
    },
    output: {
        path: path.join(__dirname, 'public/dist/'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference，
                query: {
                    plugins: ["transform-class-properties"],
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};