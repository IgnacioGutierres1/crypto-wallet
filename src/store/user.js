export default {
  namespaced: true,
  state: {
    userName: "",
    userId: "",
  },
  getters: {
    getUserName(state) {
      return state.userName;
    },
    getUserId(state) {
      return state.userId;
    },
  },
  mutations: {
    setUserName(state, userName) {
      state.userName = userName;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
  actions: {
    saveUser({ commit }, userName) {
      const alphanumericId = Math.random().toString(36).slice(2, 12);
      commit("setUserName", userName);
      commit("setUserId", alphanumericId);
    },
  },
};
