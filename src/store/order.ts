import type { ActionTree, Module, MutationTree } from 'vuex';

import { OrderService } from '@/services';
import { OrderStatus } from '@/utils/consts';
import { RootState } from './root';

export interface OrderState {
  orderId: string;
  orderStatus: OrderStatus;
}

const state: OrderState = {
  orderId: '',
  orderStatus: OrderStatus.WAITING,
};

const mutations: MutationTree<OrderState> = {
  updateOrderId(state, id) {
    state.orderId = id;
  },
   
  updateOrderStatus(state, status) {
    state.orderStatus = status;
  },
};

const actions: ActionTree<OrderState, RootState> = {
  async createOrder({ commit, rootState: { user } }) {
    const orderId = await OrderService.createOrder(user.shopId, []);
    commit('updateOrderId', orderId);
  }, 
};

export const OrderStore: Module<OrderState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}