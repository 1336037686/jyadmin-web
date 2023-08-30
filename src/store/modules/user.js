import { login, register, refreshToken, logout, getInfo } from '@/api/system/auth/jy-auth'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

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
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password, uniqueId, captcha } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, uniqueId, captcha }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        commit('SET_REFRESH_TOKEN', data.refreshToken)
        setToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  register({ commit }, registerInfo) {
    const { phone, uniqueId, captcha } = registerInfo
    return new Promise((resolve, reject) => {
      register({ phone: phone.trim(), uniqueId: uniqueId, captcha }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.accessToken)
        commit('SET_REFRESH_TOKEN', data.refreshToken)
        setToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // token续期
  refreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      const rsToken = getRefreshToken()
      if (!rsToken) return
      refreshToken(rsToken).then(res => {
        commit('SET_TOKEN', res.data)
        setToken(res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, permissions, id, username, nickname, avatar, phone, type } = data

        // roles必须为非空数组
        if (!roles || roles.length <= 0) reject('getInfo: roles must be a non-null array!')
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
  // 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        // 清除Token
        removeToken()
        resetRouter()
        // 重置访问过的视图和缓存的视图 to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 清除所有token信息，以及相关权限信息
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_PERMISSIONS', [])
      removeToken()
      removeRefreshToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
