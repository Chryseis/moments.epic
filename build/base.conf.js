const path = require('path')

module.exports = {
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, '../src')
                ],
                exclude: [
                    path.resolve(__dirname, '../node_modules')
                ],
                use: ['babel-loader']
            }, {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/img/[name][hash:7].[ext]'
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.less']
    }
}