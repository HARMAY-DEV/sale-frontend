import Vue from 'vue';
import Vuex from 'vuex';

import { UserStore } from './user';
import { CartStore } from './cart';
import { OrderStore } from './order';
import { FlowStore } from './flow';
import { H5Store } from './h5';
// import { getHeaderImage } from "@/api/user"
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: UserStore,
    cart: CartStore,
    order: OrderStore,
    flow: FlowStore,
    h5: H5Store,
  },
});
