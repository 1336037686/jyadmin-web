import { constantRoutes } from '@/router'
import Layout from '@/layout'
import SubLayout from '@/layout/sub-layout'
import { getMenus } from '@/api/system/auth/jy-auth'

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
export function convert(routes, fullPath) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // 如果是按钮
    if (tmp.type === 2) return
    const tmpObj = {}
    // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
    tmpObj.hidden = tmp.visiable === 0
    // 路由路径
    tmpObj.path = tmp.url
    // 获取当前路由全路径
    tmpObj.fullPath = tmpObj.path.startsWith('/') ? (fullPath + tmpObj.path) : (fullPath + '/' + tmpObj.path)
    // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    tmpObj.name = tmp.code
    // 如果不是外链
    if (tmp.link === 0) {
      // 组件
      if (tmp.path === 'Layout') tmpObj.component = Layout // 根节点
      else if (tmp.path === 'SubLayout') tmpObj.component = SubLayout // 二级页面根节点
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
      const children = convert(tmp.children, tmpObj.fullPath)
      // 如果子节点不为空，才设置子菜单
      if (children && children.length > 0) {
        tmpObj.children = children
        // if set true, will always show the root menu
        tmpObj.alwaysShow = true
        // 如果有下级菜单，默认设置redirect为第一个菜单
        if (tmpObj.children && tmpObj.children.length > 0) {
          tmpObj.redirect = tmpObj.children[0].fullPath
        }
      }
    }
    res.push(tmpObj)
  })
  return res
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      getMenus().then(response => {
        const { data } = response
        // 动态路由
        const accessedRoutes = convert(data, '')
        // 404 page must be placed at the end !!!
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
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
