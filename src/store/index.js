/* eslint-disable no-unused-vars */

import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import global from './modules/global'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    global
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
