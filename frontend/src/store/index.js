import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    user: {}
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
    }, 
    USER_LOGGED(state, value) {
      state.user = value
    }
  },
  actions: {
    changelogged(context, value) {
      context.commit('LOGGED_TRUE', value)
    },
    getuserinf(context, value) {
      context.commit('USER_LOGGED', value)
    }
  },
  modules: {
  },
})
