import type { ActionTree, Module, MutationTree } from 'vuex';

import { CartService } from '@/services';
import { StorageKey } from '@/utils/consts';
import { Storage } from '@/utils/storage';
import { RootState } from './root';

interface GoodsInfo {
  id: string;
  name: string;
  price: number;
  spec: {
    id: string;
    name: string;
  };
  picture: string;
  stock: number;
  quantity: number;
  sn:string
}

interface CartData {
  goodsId: string;
  price: number;
  cartId?: string;
  quantity?: number;
  sn:string
}

export interface CartState {
  cartId: string;
  searchGoods: Nullable<GoodsInfo>;
  goodsList: GoodsInfo[];
  totalAmount: number;
  totalCount: number;
}

const state: CartState = {
  cartId: Storage.getItem(StorageKey.CART_ID) || '',
  goodsList: [],
  searchGoods: null,
  totalAmount: 0,
  totalCount: 0,
};

// 使用接口返回数据
// const getters: GetterTree<CartState, RootState> = {
//   goodsCount(state) {
//     return state.goodsList.reduce((acc, cur) => acc += cur.quantity, 0);
//   },
//   goodsValue(state) {
//     return state.goodsList.reduce((acc, cur) => acc += cur.quantity * cur.price, 0);
//   }
// }

const mutations: MutationTree<CartState> = {
  updateCartId(state, cartId: string) {
    state.cartId = cartId;
    Storage.setItem(StorageKey.CART_ID, cartId);
  },

  updateGoodsInfo(state, goods: GoodsInfo) {
    console.log(goods)
    state.searchGoods = goods;
  },

  updateGoodsList(state, { goodsList, totalAmount, totalCount }) {
    // console.log(state)
    // if(state.sn)
    if (goodsList.length === 0) {
      state.cartId = '';
      Storage.removeItem(StorageKey.CART_ID);
    }
    state.goodsList = goodsList;
    state.totalAmount = totalAmount.toFixed(2);
    state.totalCount = totalCount;
  },

  // 清空购物车目前只有前端清空，不涉及服务端
  clearCart(state) {
    state.goodsList = [];
    state.cartId = '';
    state.totalAmount = 0;
    state.totalCount = 0;
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

    const result = await CartService.getShoppingCartGoodsList(state.cartId);

    commit('updateGoodsList', result);
  },

  async addToCart({ state, commit }, { goodsId, price, cartId = state.cartId, quantity = 1, sn}: CartData) {
    const { cartId: _cartId, ...data }  = await CartService.addGoodsToShoppingCart(goodsId, cartId, price, quantity,sn);
    console.log('打印222--')
    console.log(sn)
    console.log(goodsId)
    commit('updateCartId', _cartId);
    commit('updateGoodsList', data);
  },

  async removeFromCart({ state, commit }, { goodsId, cartId = state.cartId, quantity = 1, sn}: CartData) {
    const { cartId: _cartId, ...data }  = await CartService.removeGoodsFromShoppingCart(goodsId, cartId, quantity, sn);
    console.log('打印--')
    console.log(sn)
    console.log(goodsId)
    commit('updateCartId', _cartId);
    commit('updateGoodsList', data);

  }
};

export const CartStore: Module<CartState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}