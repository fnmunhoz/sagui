import express from 'express'
import webpack from 'webpack'

/**
 * Development server
 * @param  {Object} webpackConfig
 * @return express application
 */
export default function (webpackConfig) {
  const app = express()
  const compiler = webpack(webpackConfig)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true
  }))

  app.use(require('webpack-hot-middleware')(compiler))

  return app
}
