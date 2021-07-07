import type { ActionTree, Module, MutationTree } from 'vuex';

import { UserService } from '@/services';
import { StorageKey } from '@/utils/consts';
import { Storage } from '@/utils/storage';
import { RootState } from './root';

export interface LoginData {
  username: string;
  password: string;
  shopId: string;
}

export interface UserState {
  isLogin: boolean;
  userId: number;
  shopId: string;
  shopList: Array<{
    shopId: string;
    shopName: string;
    isActive: boolean;
  }>;
}

const state: UserState = {
  isLogin: !!Storage.getItem(StorageKey.IS_LOGIN),
  userId: Storage.getItem(StorageKey.USER_ID) || NaN,
  shopId: Storage.getItem(StorageKey.SHOP_ID) || '',
  shopList: [],
};

const mutations: MutationTree<UserState> = {
  updateLoginStatus(state) {
    state.isLogin = true;
    Storage.setItem(StorageKey.IS_LOGIN, true);
  },

  updateUserId(state, id) {
    state.userId = id;
    Storage.setItem(StorageKey.USER_ID, id);
  },

  updateShopId(state, id) {
    state.shopId = id;
    Storage.setItem(StorageKey.SHOP_ID, id);
  },

  updateShopList(state, shopList) {
    state.shopList = shopList;
  },
};

const actions: ActionTree<UserState, RootState> = {
  async login({ commit }, { username, password, shopId }: LoginData) {
    const userId = await UserService.login(username, password, shopId);
    commit('updateLoginStatus');
    commit('updateUserId', userId);
    commit('updateShopId', shopId);
  },

  async getShopList({ commit }) {
    const shopList = await UserService.getShopList();
    commit('updateShopList', shopList);
  }
};

export const UserStore: Module<UserState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}