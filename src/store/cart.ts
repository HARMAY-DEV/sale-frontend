import Vuex, { ActionTree, Module, MutationTree } from 'vuex';
import { CartService } from '@/services';

interface GoodsInfo {
  id: string;
  name: string;
  price: string;
  spec: {
    id: string;
    name: string;
  };
  picture: string;
  stock: number;
}

interface CartState {
  searchGoods: Nullable<GoodsInfo>;
  goodsList: GoodsInfo[];
}

const state: CartState = {
  goodsList: [],
  searchGoods: null,
};

const mutations: MutationTree<CartState> = {
  updateGoodsInfo(state, payload) {
    state.searchGoods = payload;
  },
};

const actions: ActionTree<CartState, {}> = {
  async getGoodsInfo({ commit }, id: string) {
    const result = await CartService.getGoodsInfo(id);
    commit('updateGoodsInfo', result);
  },
};

export const CartStore: Module<CartState, {}> = {
  namespaced: true,
  state,
  mutations,
  actions,
}