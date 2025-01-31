export default {
  namespaced: true,
  state: {
    userName: "",
    userId: "",
    login: false,
  },
  getters: {
    userName(state) {
      return state.userName;
    },
    userId(state) {
      return state.userId;
    },
    login(state) {
      return Boolean(state.userId);
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
