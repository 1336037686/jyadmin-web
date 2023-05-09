import basicSettingApi from '@/api/system/basic-setting/jy-basic-settings'
import { getBasicSettings, setBasicSettings } from '@/utils/basic-settings'
const state = {
  settings: getBasicSettings()
}

const mutations = {
  SET_SETTINGS: (state, settings) => {
    state.settings = settings
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
        // 保存到cookie中，防止vuex刷新状态消失
        setBasicSettings(settings)
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
