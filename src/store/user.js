export default {
  namespaced: true,
  state: {
    userName: localStorage.getItem("userName") || "",
    userId: localStorage.getItem("userId") || "",
    wallet: {
      ars: 0,
      cryptos: {},
    },
    login: false,
  },
  getters: {
    userName(state) {
      return state.userName;
    },
    userId(state) {
      return state.userId;
    },
    wallet(state) {
      return state.wallet;
    },
    login(state) {
      return state.userId !== "" && state.userId !== null;
    },
  },
  mutations: {
    setUser(state, { userName, userId, wallet }) {
      state.userName = userName;
      state.userId = userId;
      state.wallet = wallet;
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId);
      localStorage.setItem("wallet", wallet);
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

    async loadWallet({commit}, state) {
      try {
        const request = await axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${state.userId}"}`,
        {
          headers: {
            "x-apikey": "60eb09146661365596af552f",
          }
        });
        for(const transactions of request.data._id) {
          if(transactions.action === "purchase") {
            state.wallet.ars -= transactions.money;
          } else if (transactions.action === "sale") {
            state.wallet.ars += transactions.money;
          }
            if(state.wallet.cryptos[transactions.crypto_code]) {
              state.wallet.cryptos = transactions.crypto_amount;
            } else {
              state.wallet.cryptos = transactions.crypto_code;
              state.wallet.cryptos + transactions.crypto_amount;
            }
          }

          commit("setUser", wallet?)
        }
      } 
    }

    logOut({ commit }) {
      commit("setUser", { userName: "", userId: "" });
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
    },
  },
};
