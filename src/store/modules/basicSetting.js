import basicSettingApi from '@/api/system/basic-setting/jy-basic-setting'

const state = {
  settings: {}
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
