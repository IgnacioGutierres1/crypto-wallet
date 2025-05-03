import { createStore } from "vuex";
import user from "./user";
import cryptostore from "./cryptostore";
import ui from "./ui";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    cryptostore,
    ui,
  },
});
