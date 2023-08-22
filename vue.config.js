'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['html', 'js', 'css', 'png', 'jpg', 'jpeg', 'svg']

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'jyadmin' // page title

// 如果端口设置为80，使用管理员权限执行命令行。
// 例如, Mac: sudo npm run
// 修改端口的方法如下:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// 所有配置项说明请参见 https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false, // process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    hot: true, // 自动保存
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        // target: 'http://175.178.96.162:8081/api/', // 你请求的第三方接口
        target: 'http://localhost:8081/api/', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请 求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: { // 路径重写，/api/customer/list
          '^/api': '' // 替换target中的请求地址，也就是说以后你在请求 http://localhost:8080/api/customer/list这个地址的时候直接写成/api即可
        }
      }
    }
  },
  configureWebpack: {
    // 在webpack的name字段中提供应用的标题，这样可以在index.html中访问它以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 102400, // 对超过100k的数据压缩
        minRatio: 0.9,
        deleteOriginalAssets: false // 是否删除原文件
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 8, // 最大块数量
        minChunkSize: 10240 // 最小块大小
      })
    ]
  },
  chainWebpack(config) {
    // 它可以提高首屏速度，建议开启预加载
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // 当页面很多的时候，会产生太多无意义的请求
    config.plugins.delete('prefetch')

    // 设置svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              minSize: 30000,
              maxSize: 300000,
              minChunks: 1,
              maxAsyncRequests: 8,
              maxInitialRequests: 5,
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                },
                default: {
                  minChunks: 2, // 模块至少被引用的次数
                  priority: -20, // 缓存组的优先级
                  reuseExistingChunk: true // 如果模块已经存在于其他块中，则复用现有的块
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
