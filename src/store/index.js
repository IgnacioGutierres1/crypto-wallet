import { createStore } from "vuex";
import user from "./user";
import cryptostore from "./cryptostore";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    cryptostore,
  },
});
