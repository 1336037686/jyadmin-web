import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import {getMenus} from "@/api/jy-auth";


const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

// 路由拼接
function loadView(view) {
  if (!view) return view
  return function(resolve) {
    require([`@/views/${view}`], resolve)
  }
}

// 将请求数据转换为 element-admin 路由的数据格式
export function convert(routes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // 如果是按钮
    if (tmp.type === 2) return
    let tmpObj = {}
    // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
    tmpObj.hidden = tmp.visiable === 0
    // 路由路径
    tmpObj.path = tmp.url
    // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    tmpObj.name = tmp.code
    // 如果不是外链
    if (tmp.link === 0) {
      // 组件
      if (tmp.path === "Layout") tmpObj.component = Layout
      else tmpObj.component = loadView(tmp.path)
    }
    tmpObj.meta = {}
    // 设置该路由在侧边栏和面包屑中展示的名字
    tmpObj.meta.title = tmp.name
    // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    tmpObj.meta.icon = tmp.icon
    // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    tmpObj.meta.noCache = !(tmp.cache === 0)
    // children
    if (tmp.children && tmp.children.length > 0) {
      // if set true, will always show the root menu
      // tmpObj.alwaysShow = true
      tmpObj.children = convert(tmp.children)
    }
    res.push(tmpObj)
  })
  return res
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      getMenus().then(response => {
        let { data } = response
        // 动态路由
        let accessedRoutes = convert(data)
        // 其他异步路由
        // accessedRoutes = accessedRoutes.concat(asyncRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
