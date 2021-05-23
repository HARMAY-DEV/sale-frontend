import type { ActionTree, GetterTree, Module, MutationTree } from 'vuex';

import { CartService } from '@/services';
import { StorageKey } from '@/utils/consts';
import { Storage } from '@/utils/storage';
import { RootState } from './root';

interface GoodsInfo {
  id: string;
  name: string;
  price: number;
  spec: string;
  picture: string;
  stock: number;
  quantity: number;
}

interface CartData {
  goodsId: string;
  cartId?: string;
  quantity?: number;
}

export interface CartState {
  cartId: string;
  searchGoods: Nullable<GoodsInfo>;
  goodsList: GoodsInfo[];
}

const state: CartState = {
  cartId: Storage.getItem(StorageKey.CART_ID) || '',
  goodsList: [],
  searchGoods: null,
};

const getters: GetterTree<CartState, RootState> = {
  goodsCount(state) {
    return state.goodsList.reduce((acc, cur) => acc += cur.quantity, 0);
  },
  goodsValue(state) {
    return state.goodsList.reduce((acc, cur) => acc += cur.quantity * cur.price, 0);
  }
}

const mutations: MutationTree<CartState> = {
  updateCartId(state, payload: string) {
    state.cartId = payload;
    Storage.setItem(StorageKey.CART_ID, payload);
  },

  updateGoodsInfo(state, payload) {
    state.searchGoods = payload;
  },

  updateGoodsList(state, payload) {
    state.goodsList = payload;
  },

  // 清空购物车目前只有前端清空，不涉及服务端
  clearCart(state) {
    state.goodsList = [];
    state.cartId = '';
    Storage.removeItem(StorageKey.CART_ID);
  },
};

const actions: ActionTree<CartState, RootState> = {
  async getGoodsInfo({ commit }, id: string) {
    const result = await CartService.getGoodsInfo(id);
    commit('updateGoodsInfo', result);
  },

  async getCartGoodsList({ state, commit }) {
    if (!state.cartId) return;

    const goodsList = await CartService.getShoppingCartGoodsList(state.cartId);

    commit('updateGoodsList', goodsList);
  },

  async addToCart({ state, commit }, { goodsId, cartId = state.cartId, quantity = 1 }: CartData) {
    const { cartId: _cartId, goodsList }  = await CartService.addGoodsToShoppingCart(goodsId, cartId, quantity);

    commit('updateCartId', _cartId);
    commit('updateGoodsList', goodsList);
  },

  async removeFromCart({ state, commit }, { goodsId, cartId = state.cartId, quantity = 1 }: CartData) {
    const { cartId: _cartId, goodsList }  = await CartService.removeGoodsFromShoppingCart(goodsId, cartId, quantity);

    commit('updateCartId', _cartId);
    commit('updateGoodsList', goodsList);
  }
};

export const CartStore: Module<CartState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}