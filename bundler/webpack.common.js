const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
    entry: {
        terminal: path.resolve(__dirname, '../src/terminal.js'),
    },
    output:
    {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist')
    },
    devtool: 'source-map',
    plugins:
    [
        new MiniCSSExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/terminal.html'),
            minify: true,
            chunks: ['terminal']
        })
    ],
    module:
    {
        rules:[
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    }
}
