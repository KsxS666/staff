const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css'] // 定义压缩文件类型

module.exports = {
  assetsDir: 'static',

  devServer: {
    port: '8999',
    proxy: {
      '/backend': {
        // target: 'http://120.42.54.20:10000', // 正式地址
        // target: 'http://172.16.20.24:10000', // pf 正式地址
        // target: 'http://120.42.54.19:10000', // 正式地址
        target: 'http://172.16.21.132:10000', // 测试地址
        changeOrigin: true,
        pathRewrite: {
          '^/backend': ''
        }
      }
    },
    overlay: {
      warnings: true,
      errors: false
    }
  },

  // lintOnSave: process.env.NODE_ENV === 'production' ? false : 'error',
  lintOnSave: process.env.NODE_ENV !== 'production',

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, './src/styles/common.scss')
      ]
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 去掉 console 和 报错
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      // 打包开启gzip压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 1024 * 10, // 对超过10k的数据压缩
          minRatio: 0.8
        })
      )
    }
  }
}
