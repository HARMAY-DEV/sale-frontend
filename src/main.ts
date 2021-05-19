import Vue from 'vue';
import {install} from '@icon-park/vue/es/all';
import App from './App.vue';
import router from './router';
import store from './store';
import { useElementComponent } from './element-ui';

install(Vue, 'ip');

// 组织页面被拖来拖去，移动平台上的果冻效果
document.body.addEventListener('touchmove', function (e) {
  e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, {passive: false});

useElementComponent();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
