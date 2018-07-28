// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/iconfont/iconfont.css'
import '@/assets/css/common.css'
// import request from './utils/request'
import store from './store'
import {
    sync
} from 'vuex-router-sync'
import * as filters from './filters'
// import echarts from 'echarts' //引入echart
import axios from './lib/axios'
var VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper, /* { default global options } */ )

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;
Vue.use(ElementUI);
    // Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios;
window.axios=axios;
router.afterEach(route => {
    // console.log(route);
    document.title = route.meta.title
});

sync(store, router);

/* eslint-disable no-new */
Promise.all([store.dispatch("getCodeInfo"),store.dispatch("changeMenus")]).then(function(item1,item2){
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  });
});

