import Vue from 'vue';
import Vuex from 'vuex';

import usersModule from './modules/users';
import groupsModule from './modules/groups';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users: usersModule,
    groups: groupsModule,
  },
  state: {
    userID: null,
    status: {},
  },
  mutations: {
    setUser: (state, userID) => {
      state.userID = userID;
    },
    setStatus: (state, status) => {
      state.status = status;
    },
  },
  getters: {
    userID: state => state.userID,
    status: state => state.status,
  },
  actions: {
  },
});
