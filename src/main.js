import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// 图标选择器
import eIconPicker from 'e-icon-picker'
import 'e-icon-picker/lib/symbol.js' // 基本彩色图标库
import 'e-icon-picker/lib/index.css' // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css' // font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css' // element-ui 图标库
// 全局删除增加图标
Vue.use(eIconPicker, {
  FontAwesome: true,
  ElementUI: true,
  eIcon: true, // 自带的图标，来自阿里妈妈
  eIconSymbol: true, // 是否开启彩色图标
  addIconList: [],
  removeIconList: [],
  zIndex: 3100// 选择器弹层的最低层,全局配置
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

import VForm from 'vform-builds' // 引入VForm库
import 'vform-builds/dist/VFormDesigner.css' // 引入VForm样式
Vue.use(VForm) // 全局注册VForm(同时注册了v-form-designer和v-form-render组件)

// 添加字典工具类
import dict from '@/utils/dict'
Vue.use(dict)

// 添加表格列判断工具类
import columns from '@/utils/columns'
Vue.use(columns)

// 权限判断
import permission from '@/directive/permission'
Vue.use(permission)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// 去除Vue 日志与警告
// Vue.config.silent = true
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
