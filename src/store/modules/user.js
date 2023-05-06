import { login, refreshToken, logout, getInfo } from '@/api/system/auth/jy-auth'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

// 使用refreshToken对登录状态进行续期，refreshToken获取token
let timeExpire = null // 定时器 accessToken 1h 过期， refreshToken 12h 过期
const refreshTokenExpire = 40 * 60 * 1000 // 间隔时间 (ms) 每隔40分钟刷新一次token

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  name: '',
  introduction: '',
  id: '',
  username: '',
  nickname: '',
  avatar: '',
  phone: '',
  type: 1,
  createTime: '',
  updateTime: '',
  deleted: '',
  roles: [],
  permissions: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, uniqueId, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, uniqueId, captcha }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        commit('SET_REFRESH_TOKEN', data.refreshToken)
        setToken(data.accessToken)
        setRefreshToken(data.refreshToken)

        // 设置定时器，定时根据refreshToken刷新token
        if (timeExpire) clearInterval(timeExpire)
        timeExpire = setInterval(() => {
          const rsToken = getRefreshToken()
          refreshToken(rsToken).then(res => {
            commit('SET_TOKEN', res.data)
            setToken(res.data)
          })
        }, refreshTokenExpire)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, permissions, id, username, nickname, avatar, phone, type } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_ID', id)
        commit('SET_USERNAME', username)
        commit('SET_NICKNAME', nickname)
        commit('SET_AVATAR', avatar)
        commit('SET_PHONE', phone)
        commit('SET_TYPE', type)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        // 清楚续期定时器
        if (timeExpire) clearInterval(timeExpire)
        // 清除Token
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      if (timeExpire) clearInterval(timeExpire)
      removeRefreshToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
