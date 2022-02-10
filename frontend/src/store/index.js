import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false
  },
  plugins: [createPersistedState({
    storage: {
      getItem: key => Cookies.get(key),
      setItem: (key, value) => Cookies.set(key, value, { expires: 1, secure: true }),
      removeItem: key => Cookies.remove(key)
    }
  })],
  mutations: {
    LOGGED_TRUE(state, value) {
      state.logged = value
    } 
  },
  actions: {
    changelogged(context, value) {
      context.commit('LOGGED_TRUE', value)
    }
  },
  modules: {
  },
})
