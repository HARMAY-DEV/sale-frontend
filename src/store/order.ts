import type { ActionTree, Module, MutationTree } from 'vuex';

import { OrderService } from '@/services';
import { OrderStatus } from '@/utils/consts';
import { RootState } from './root';

export interface OrderState {
  orderId: string;
  orderStatus: OrderStatus;
  orderList: any[];
  orderInfo: {
    paidAmount: number;
  };
}

const state: OrderState = {
  orderId: '',
  orderStatus: OrderStatus.WAITING,
  orderList: [],
  orderInfo: {
    paidAmount: 0,
  },
};

const mutations: MutationTree<OrderState> = {
  updateOrderId(state, id) {
    state.orderId = id;
  },
   
  updateOrderStatus(state, status) {
    state.orderStatus = status;
  },

  updateOrderList(state, list) {
    state.orderList = list;
  },

  updateOrderInfo(state, info) {
    state.orderInfo = info;
  }
};

const actions: ActionTree<OrderState, RootState> = {
  async createOrder({ dispatch, commit, rootState: { user, cart } }) {
    const orderId = await OrderService.createOrder(user.shopId, cart.goodsList.map(goods => ({
      goods_id: goods.id,
      goods_name: goods.name,
      goods_no: goods.id,
      num: goods.quantity,
      price: goods.price,
      spec_id: goods.spec.id,
      spec_name: goods.spec.name,
      spec_no: goods.spec.id,
    })));
    commit('updateOrderId', orderId);
  }, 

  async getOrderList({ commit }) {
    const orderList = await OrderService.getOrderList();
    commit('updateOrderList', orderList);
  },
  
  async getOrderDetail({ state, commit }) {
    const { orderInfo } = await OrderService.getOrderDetail(state.orderId);
    commit('updateOrderInfo', orderInfo);
    return orderInfo;
  },

  async refundWholeOrder({ state, commit }) {
    await OrderService.createRefundOrder(state.orderId);
    commit('updateOrderId', '');
    commit('updateOrderStatus', OrderStatus.WAITING);
  }
};

export const OrderStore: Module<OrderState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}