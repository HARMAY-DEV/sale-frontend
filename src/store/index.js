import Vue from 'vue';
import Vuex from 'vuex';
import { getHeaderImage } from "@/api/user"

Vue.use(Vuex);

const state = {//要设置的全局访问的state对象
    userObj: {
        name: "HARMAY PLATINUM",
        gender: 0,
        phone: "1329****989",
        birthday: "1998-04-09",
        head: "",
        joiningTime: "2020-12-07（入会8个月）",
        integral: "15876",
        cardNumber: "0001000015833",
        lastConsumePrice:"123",
        lastConsumeDate:"2020-12-07",
        lastConsumeContent:"北京市三里屯店铺",
        notMeetDays:"24",
        age:"26"
    },
    Image: "",
    type: 0
};
const mutations = {
    SET_USEROBJ: (state, data) => {
        state.userObj = data
        state.type = 1
    },
    SET_IMAGE: (state, data) => {
        state.Image = data
    }
};
const actions = {
    getImages({ commit }) {
        getHeaderImage().then(res => {

            commit("SET_IMAGE", res.data.msg)
        })
    }
};

const store = new Vuex.Store({
    state,
    mutations,
    actions,
    modules: {

    }
});

export default store;