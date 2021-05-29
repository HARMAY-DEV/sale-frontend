import type { ActionTree, GetterTree, Module, MutationTree } from 'vuex';

import { FlowService } from '@/services';
import { RootState } from './root';
import { FlowStatus, OrderStatus, PaymentMethod } from '@/utils/consts';
import { delay } from '@/utils/delay';

interface FlowDetail {
  flowId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: FlowStatus;
}

export interface FlowState {
  flowList: FlowDetail[];
}

const state: FlowState = {
  flowList: [],
};

const getters: GetterTree<FlowState, RootState> = {
  currentFlowId(state) {
    const flow = state.flowList[state.flowList.length - 1];
    if (!flow) return '';
    return flow.flowId;
  },

  currentFlowStatus(state) {
    const flow = state.flowList[state.flowList.length - 1];
    if (!flow) return FlowStatus.DEFAULT;
    return flow.status;
  }
}

const mutations: MutationTree<FlowState> = {
  addFlow(state, flow: FlowDetail) {
    state.flowList.push(flow);
  },

  updateFlowStatus(state, status) {
    const flow = state.flowList[state.flowList.length - 1];
    if (!flow) return;
    flow.status = status;
  }
};

let timer: number;

const actions: ActionTree<FlowState, RootState> = {
  async createFlow({ commit, rootState: { order } }, { paymentMethod, amount }: Omit<FlowDetail, 'flowId'>) {
    const result = await FlowService.createFlow(order.orderId, paymentMethod, amount);

    commit('addFlow', { flowId: result.id, paymentMethod, amount, status: FlowStatus.PENDING  });
  
    commit('order/updateOrderStatus', OrderStatus.PAYING, { root: true });
  },

  async getFlowDetail({ commit, dispatch, getters }) {
    const status = await FlowService.getFlowDetail(getters.currentFlowId);
    commit('updateFlowStatus', status);

    if (status !== FlowStatus.PENDING) {
      return;
    }

    timer = setTimeout(() => {
      dispatch('getFlowDetail');
    }, 3000);
  },

  cancelLoopFlowDetail({ commit }) {
    clearTimeout(timer);
    commit('updateFlowStatus', FlowStatus.DEFAULT);
  },

  async payFlow({ getters, commit, dispatch }, dynamicId: string) {
    try {
      await FlowService.payFlow(getters.currentFlowId, dynamicId);
      await dispatch('getFlowDetail');
    } catch(error) {
      commit('updateFlowStatus', FlowStatus.FAILED);
      throw error;
    }
  },

  async getFlowList({ rootState: { order } }) {
    return FlowService.getFlowListByOrderId(order.orderId);
  },
};

export const FlowStore: Module<FlowState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}