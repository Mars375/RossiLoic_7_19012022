import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
import vuetify from '../plugins/vuetify';

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
  faCalendarAlt,
  faArrowLeft,
  faCameraRetro,
  faEllipsisH,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faUser, faChevronDown, faSearch, faMoon, faSignInAlt, faArrowRight, faEye, faEyeSlash, faTimes, faBars, faIdCard, faHome, faCalendarAlt, faArrowLeft, faCameraRetro, faEllipsisH, faPlus)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')