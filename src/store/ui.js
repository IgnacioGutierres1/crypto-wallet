export default {
  namespaced: true,
  state: {
    sidebarExpanded: false,
  },
  getters: {
    sidebarExpanded(state) {
      return state.sidebarExpanded;
    },
  },
  mutations: {
    changeSidebar(state) {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
  },
};
