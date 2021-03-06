import HtmlWebpackPlugin from 'html-webpack-plugin'
import { optimize } from 'webpack'
import { expect } from 'chai'

import { configure } from './archetype-pages'

const projectPath = '/tmp/projec-path'

describe('configure webpack pages', function () {
  describe('undefined pages', function () {
    it('should return an empty configuration', function () {
      const webpackConfig = configure({})
      expect(webpackConfig).eql({})
    })
  })

  describe('empty pages', function () {
    it('should return an empty configuration', function () {
      const webpackConfig = configure({ pages: [] })
      expect(webpackConfig).eql({})
    })
  })

  describe('single page', function () {
    const baseConfig = { pages: ['index'], projectPath }

    it('should have the output path configured as the dist folder', function () {
      const webpackConfig = configure(baseConfig)
      expect(webpackConfig.output.path).eql('/tmp/projec-path/dist')
    })

    it('should have the entrypoints setup with the index', function () {
      const webpackConfig = configure(baseConfig)

      expect(webpackConfig.entry).eql({
        index: ['./index']
      })
    })

    it('should have a plugin seting up the HTML template', function () {
      const webpackConfig = configure(baseConfig)

      const html = webpackConfig.plugins.filter(plugin => plugin instanceof HtmlWebpackPlugin)
      expect(html.length).equal(1)

      const options = html[0].options

      expect(options.chunks).deep.eql([ 'common', 'index' ])
      expect(options.filename).deep.eql('index.html')
      expect(options.template).deep.eql('index.html')
    })

    it('should setup the output filename of entrypoints based on the name of the page and hash', function () {
      const webpackConfig = configure(baseConfig)
      expect(webpackConfig.output.filename).eql('[name]-[hash].js')
    })

    it('should setup the output filename of other files based on their name and hash', function () {
      const webpackConfig = configure(baseConfig)
      expect(webpackConfig.output.chunkFilename).eql('[name]-[hash].chunk.js')
    })

    it('should NOT have the CommonsChunkPlugin enabled (not needed)', function () {
      const webpackConfig = configure(baseConfig)

      const commons = webpackConfig.plugins.filter(plugin => plugin instanceof optimize.CommonsChunkPlugin)
      expect(commons.length).equal(0)
    })
  })

  describe('multiple pages', function () {
    const baseConfig = { pages: ['index', 'demo'], projectPath }

    it('should have two distinct entrypoints', function () {
      const webpackConfig = configure(baseConfig)

      expect(webpackConfig.entry).eql({
        index: ['./index'],
        demo: ['./demo']
      })
    })

    it('should have a plugin seting up the HTML template for each chunk', function () {
      const webpackConfig = configure(baseConfig)

      const html = webpackConfig.plugins.filter(plugin => plugin instanceof HtmlWebpackPlugin)
      expect(html.length).equal(2)

      const firstOptions = html[0].options
      expect(firstOptions.chunks).deep.eql([ 'common', 'index' ])
      expect(firstOptions.filename).deep.eql('index.html')
      expect(firstOptions.template).deep.eql('index.html')

      const secondOptions = html[1].options
      expect(secondOptions.chunks).deep.eql([ 'common', 'demo' ])
      expect(secondOptions.filename).deep.eql('demo.html')
      expect(secondOptions.template).deep.eql('demo.html')
    })

    it('should have the CommonsChunkPlugin enabled', function () {
      const webpackConfig = configure(baseConfig)

      const commons = webpackConfig.plugins.filter(plugin => plugin instanceof optimize.CommonsChunkPlugin)
      expect(commons.length).equal(1)
    })

    // Karma has an issue with the CommonsChunk plugin
    // see: https://github.com/webpack/karma-webpack/issues/24
    it('should NOT have the CommonsChunkPlugin enabled if buildTarget is test (breaks Karma)', function () {
      const webpackConfig = configure({ ...baseConfig, buildTarget: 'test' })

      const commons = webpackConfig.plugins.filter(plugin => plugin instanceof optimize.CommonsChunkPlugin)
      expect(commons.length).equal(0)
    })
  })
})
