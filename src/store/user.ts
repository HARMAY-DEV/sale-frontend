import type { ActionTree, Module, MutationTree } from 'vuex';

import { UserService } from '@/services';
import { StorageKey } from '@/utils/consts';
import { Storage } from '@/utils/storage';

export interface LoginData {
  username: string;
  password: string;
  shopId: string;
}

interface UserState {
  isLogin: boolean;
  shopList: Array<{
    
  }>;
}

const state: UserState = {
  isLogin: !!Storage.getItem(StorageKey.IS_LOGIN),
  shopList: [],
};

const mutations: MutationTree<UserState> = {
  updateLoginStatus(state) {
    state.isLogin = true;
  },
};

const actions: ActionTree<UserState, {}> = {
  async login({ commit }, { username, password, shopId }: LoginData) {
    await UserService.login(username, password, shopId);
    commit('updateLoginStatus');
  },
};

export const UserStore: Module<UserState, {}> = {
  namespaced: true,
  state,
  mutations,
  actions,
}