const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const RenderConfig = {
    entry: './public/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    mode: 'development',
    target: 'electron-renderer',
    devtool: "source-map",
    module: {
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: ['babel-loader']
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({template: './public/index.html'}),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns:[
                { from: path.resolve(__dirname, 'resource'), to: '.' }
            ]
        })
    ]
}

module.exports = [RenderConfig];