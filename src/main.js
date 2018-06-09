import Vue from 'vue'

import App from './App.vue'


// Routing Support
// import VueRouter from 'vue-router'
// import {
//   routes
// } from './routes'

// Vuex Store Support
// import store from './store/store';

// Vue.use(VueRouter)

// const router = new VueRouter({
//   mode: 'history',
//   routes
// })

new Vue({
  el: '#build',
  // router,
  // store,
  render: h => h(App)
})
