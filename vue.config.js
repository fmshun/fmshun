const zlConfig = require('./zlconfig.json')
const pages = zlConfig.pages
const isProduction = process.env.NODE_ENV === 'production'
const externals = [
  '/common/vendor/jquery-2.1.4/jquery-2.1.4.min.js',
  '/common/vendor/vue-2.6/vue.min.js',
  '/common/vendor/iscroll-4.2.2/iscroll-4.2.2.js',
  '/common/vendor/vue-2.6/vue-router.js',
  '/common/vendor/vue-2.6/vue-meta.min.js',
  '/common/scripts/base.js',
  '/common/scripts/ajax.js',
  '/common/scripts/local.js',
  '/common/scripts/file.js',
  '/common/scripts/navigation-bar.js',
  /*
   * 注意：额外引入的文件,不再通过在externals数组里增加的方式;
   * 而是采用如下动态方式，按需引入：
   * （ps：不推荐，请尽量将相关代码放在项目中统一管理，或者创建common-project的方式进行管理）
   * this.$loadScripts(['/common/scripts/file.js','/common/scripts/local.js']).then(() => {
   *    todoNextAction()
   * })
   */
]
const cssExternals = ['/common/styles/prompt.css', '/common/styles/base.css']
const ajaxEngine =
  /* 'http://168.63.129.236:30080' */ process.env.API_BASE_URL || ''
const externalsSrc = isProduction
  ? externals
  : externals.map((external) => ajaxEngine + external)
const cssExternalsSrc = isProduction
  ? cssExternals
  : cssExternals.map((cssExternal) => ajaxEngine + cssExternal)

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: './web_cft/financing-aip',
  filenameHashing: false,
  pages: createPages(pages),
  devServer: {
    ...(process.env.MOCK // Proxy API endpoints a local mock API.
      ? {
          before: require('./tests/mock-api'),
        } // Proxy API endpoints to the production base URL.
      : {
          proxy: {
            '/req*': {
              target: process.env.API_BASE_URL,
            },
            '/common*': {
              target: process.env.API_BASE_URL,
            },
            '/licai*': {
              target: process.env.API_BASE_URL,
            },
          },
        }),
  },
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'vue-meta': 'VueMeta',
      base: 'base',
      file: 'file',
      local: 'local',
      ajax: 'ajax',
      NavigationBar: 'NavigationBar',
      talkingData: 'TalkingData',
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap((options) => {
        options.fallback.options.name = 'img/[name].[hash:4].[ext]'
        return options
      })
    pages.map((page) => {
      config.plugin('html-' + page).tap((args) => {
        args[0].externals = externalsSrc
        args[0].cssExternals = cssExternalsSrc
        return args
      })
    })
  },
}

function createPages(pages) {
  let pagesResult = {}
  pages.map((page) => {
    pagesResult[page] = {
      entry: 'src/projects/' + page + '/main.js',
      template: 'public/index.html',
      filename: page + '.html',
      title: page,
    }
  })
  return pagesResult
}
