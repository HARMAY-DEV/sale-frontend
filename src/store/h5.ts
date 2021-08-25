import type { ActionTree, Module, MutationTree } from 'vuex';
import { getHeaderImage } from "@/api/user"
import { RootState } from './root';

export interface H5State {
  userObj: {
    name: string,
    gender: number,
    phone: string,
    birthday: string,
    head: string,
    joiningTime: string,
    integral: string,
    cardNumber: string,
    lastConsumePrice: string,
    lastConsumeDate: string,
    lastConsumeContent: string,
    notMeetDays: string,
    age: string
  },
  Image: string,
  type: number,
  isShowMeau: true
}

const state: H5State = {
  userObj: {
    name: "HARMAY PLATINUM",
    gender: 0,
    phone: "1329****989",
    birthday: "1998-04-09",
    head: "",
    joiningTime: "2020-12-07（入会8个月）",
    integral: "15876",
    cardNumber: "0001000015833",
    lastConsumePrice: "123",
    lastConsumeDate: "2020-12-07",
    lastConsumeContent: "北京市三里屯店铺",
    notMeetDays: "24",
    age: "26",
  },
  Image: "",
  type: 0,
  isShowMeau: true
};

const mutations: MutationTree<H5State> = {
  SET_USEROBJ: (state, data) => {
    state.userObj = data
    state.type = 1
  },
  SET_IMAGE: (state, data) => {
    state.Image = data
  },
  SET_TYPE: (state, data) => {
    state.type = data
  },
  SET_MEAU: (state, data) => {
    state.isShowMeau = data
  },
  CLEAR: (state, data) => {
    state.type = data
  }
};

const actions: ActionTree<H5State, RootState> = {
  getImages({ commit }) {
    getHeaderImage().then(res => {
      commit("SET_IMAGE", res.data.msg)
    })
  },
  setType({ commit }) {
    commit("SET_TYPE", 1)
  },
  setMeauFalse({commit}) {
    commit("SET_MEAU", false)
  },
  setMeauTrue({commit}) {
    commit("SET_MEAU", true)
  },
  clearInfo({commit}) {
    commit("CLEAR", 0)
  }
};

export const H5Store: Module<H5State, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
}