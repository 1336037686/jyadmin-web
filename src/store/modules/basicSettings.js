import basicSettingApi from '@/api/system/basic-setting/jy-basic-settings'
import { getRsaPublicKey } from '@/api/system/auth/jy-auth'
import { getBasicSettings, setBasicSettings, getLocalStorageRsaPublicKey, setLocalStorageRsaPublicKey } from '@/utils/basic-settings'
const state = {
  settings: getBasicSettings(),
  rsaPublicKey: getLocalStorageRsaPublicKey()
}

const mutations = {
  SET_SETTINGS: (state, settings) => {
    state.settings = settings
  },
  SET_RSA_PUBLIC_KEY: (state, rsaPublicKey) => {
    state.rsaPublicKey = rsaPublicKey
  }
}

const actions = {
  getBasicSettings({ commit }) {
    return new Promise((resolve, reject) => {
      basicSettingApi.getList().then(response => {
        const data = (response.data && response.data.length > 0) ? response.data : []
        const settings = {}
        for (let i = 0; i < data.length; i++) {
          settings[data[i].code] = data[i].value
        }
        commit('SET_SETTINGS', settings)
        // 保存到localstorage 中，防止vuex刷新状态消失
        setBasicSettings(settings)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getRsaPublicKey({ commit }) {
    return new Promise((resolve, reject) => {
      getRsaPublicKey().then(response => {
        commit('SET_RSA_PUBLIC_KEY', response.data)
        // 保存到localstorage 中，防止vuex刷新状态消失
        setLocalStorageRsaPublicKey(response.data)
        resolve()
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
