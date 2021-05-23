import type { ActionTree, GetterTree, Module, MutationTree } from 'vuex';

import { FlowService } from '@/services';
import { RootState } from './root';
import { FlowStatus, OrderStatus, PaymentMethod } from '@/utils/consts';

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
  addFlow(state, payload: FlowDetail) {
    state.flowList.push(payload);
  },
};

const actions: ActionTree<FlowState, RootState> = {
  async createFlow({ commit, rootState: { order } }, { paymentMethod, amount }: Omit<FlowDetail, 'flowId'>) {
    const result = await FlowService.createFlow(order.orderId, paymentMethod, amount);

    commit('addFlow', { flowId: result.id, paymentMethod, amount, status: FlowStatus.PENDING  });
  
    commit('order/updateOrderStatus', OrderStatus.PAYING, { root: true });
  },

  async payFlow({ getters }, dynamicId: string) {
    const result = await FlowService.payFlow(getters.currentFlowId, dynamicId);
    console.log(result);
  }
};

export const FlowStore: Module<FlowState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}