import Vue from 'vue';
import Vuex from 'vuex';

import { UserStore } from './user';
import { CartStore } from './cart';
import { OrderStore } from './order';
import { FlowStore } from './flow';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: UserStore,
    cart: CartStore,
    order: OrderStore,
    flow: FlowStore,
  },
});
