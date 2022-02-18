import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faChevronDown,
  faUser,
  faSearch,
  faMoon,
  faSignInAlt,
  faArrowRight,
  faEye,
  faEyeSlash,
  faTimes,
  faBars,
  faIdCard,
  faHome,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faUser, faChevronDown, faSearch, faMoon, faSignInAlt, faArrowRight, faEye, faEyeSlash, faTimes, faBars, faIdCard, faHome, faCalendarAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')