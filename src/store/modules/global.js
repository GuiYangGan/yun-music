/* eslint-disable no-unused-vars */

const state = {
  systemInfo: null,
  globalData: {}
}

const mutations = {
  setSystemInfo (state, systemInfo) {
    state.systemInfo = systemInfo
  },
  setGlobalData (state, data) {
    state.globalData = {
      ...state.globalData,
      ...data
    }
  },
  clearGlobalData (state) {
    state.globalData = {}
  }
}

const actions = {
  getSystemInfo ({commit, state}) {
    return new Promise((resolve, reject) => {
      if (state.systemInfo) {
        resolve(state.systemInfo)
      } else {
        wx.getSystemInfo({
          success (res) {
            resolve(res)
            commit('setSystemInfo', res)
          },
          fail (err) {
            reject(err)
          }
        })
      }
    })
  }
}

const getters = {
  isIphoneX: state => {
    return state.systemInfo ? state.systemInfo.model.includes('iPhone X') : false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
