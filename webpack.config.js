/**
 * Created by xiaoqing.liu on 2016/1/31.
 */
var path = require('path');

module.exports = {
    context: path.join(__dirname, 'public'),
    entry: {
        Client: ['./javascripts/client/Client.js']
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
            }
        ]
    }
};