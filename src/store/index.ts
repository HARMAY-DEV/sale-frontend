import Vue from 'vue';
import Vuex from 'vuex';

import { UserStore } from './user';
import { CartStore } from './cart';
import { OrderStore } from './order';
import { FlowStore } from './flow';
import { getHeaderImage } from "@/api/user"
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: UserStore,
    cart: CartStore,
    order: OrderStore,
    flow: FlowStore,
  },
});
