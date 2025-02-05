export default {
  namespaced: true,
  state: {
    userName: localStorage.getItem("userName") || "",
    userId: localStorage.getItem("userId") || "",
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
      return state.userId !== "" && state.userId !== null;
    },
  },
  mutations: {
    setUser(state, { userName, userId }) {
      state.userName = userName;
      state.userId = userId;
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId);
    },
  },
  actions: {
    saveUser({ commit }, userName) {
      var tempUsers = localStorage.getItem("users");
      var usersSaved = {};

      if (tempUsers !== null) {
        usersSaved = JSON.parse(tempUsers);
      }

      if (usersSaved[userName]) {
        commit("setUser", { userName: userName, userId: usersSaved[userName] });
        alert("usuario encontrado");
      } else {
        const alphanumericId = Math.random().toString(36).slice(2, 12);
        usersSaved[userName] = alphanumericId;
        localStorage.setItem("users", JSON.stringify(usersSaved));
        commit("setUser", { userName: userName, userId: alphanumericId });
      }
    },
    logOut({ commit }) {
      commit("setUser", { userName: "", userId: "" });
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
    },
  },
};
