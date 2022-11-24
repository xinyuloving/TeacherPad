import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/global.less"
import './plugins/element.js'
import '@/permission.js'
import '@/utils/im.js'
import Vue2TouchEvents from 'vue2-touch-events'
import '@/icons'
import dataPoint from '@/components/mixins/dataPoint'

import tMessage from '@/components/FunctionalComp/message/index'
Vue.use(tMessage);

import VConsole from 'vconsole'
if (process.env.NODE_ENV !== "ningxia") {
  const vConsole = new VConsole();
}

import "@/utils/adaptation"

Vue.mixin({ ...dataPoint })

Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: 'touchActive',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400,
  namespace: 'touch'
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
