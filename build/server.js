const express = require('express')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const conf = require('./dev.conf')

const app = express();
const compiler = webpack(conf);

app.use(express.static('static'))

app.use(devMiddleware(compiler, {
    publicPath: '/'
}))

app.use(hotMiddleware(compiler, {}))

app.listen(5201, () => {
    console.log('app listening 5201');
})