import Vue from 'vue';
import Vuex from 'vuex';

import { UserStore } from './user';
import { CartStore } from './cart';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: UserStore,
    cart: CartStore,
  },
});
