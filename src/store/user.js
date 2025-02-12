import axios from "axios";

export default {
  namespaced: true,
  state: {
    userName: localStorage.getItem("userName") || "",
    userId: localStorage.getItem("userId") || "",
    wallet: {
      ars: 1000000,
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
    setUser(state, { userName, userId }) {
      state.userName = userName;
      state.userId = userId;
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId);
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
      localStorage.setItem("wallet", JSON.stringify(wallet));
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

    async loadWallet({ commit, state }) {
      try {
        const request = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${state.userId}"}`,
          {
            headers: {
              "x-apikey": "60eb09146661365596af552f",
            },
          }
        );
        if (request.status === 201 || request.status === 200) {
          alert("Datos Cargados Exitosamente");
          console.log("ID: ", state.userId);
          console.log("Historial: ", request.data);
        }

        const tempWallet = {
          ars: state.wallet.ars,
          cryptos: {},
        };

        for (const transactions of request.data) {
          if (transactions.action === "purchase") {
            tempWallet.ars -= parseFloat(transactions.money);
            if (tempWallet.cryptos[transactions.crypto_code]) {
              tempWallet.cryptos[transactions.crypto_code] += parseFloat(
                transactions.crypto_amount
              );
            } else {
              tempWallet.cryptos[transactions.crypto_code] = parseFloat(
                transactions.crypto_amount
              );
            }
          } else if (transactions.action === "sale") {
            tempWallet.ars += parseFloat(transactions.money);

            if (tempWallet.cryptos[transactions.crypto_code]) {
              tempWallet.cryptos[transactions.crypto_code] -= parseFloat(
                transactions.crypto_amount
              );
            }
          }
        }

        console.log(tempWallet);

        commit("setWallet", tempWallet);
      } catch (error) {
        console.error("Error cargando wallet: ", error);
      }
    },

    logOut({ commit }) {
      commit("setUser", { userName: "", userId: "" });
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
    },
  },
};
