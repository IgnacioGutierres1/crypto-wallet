import axios from "axios";

export default {
  namespaced: true,
  state: {
    userName: localStorage.getItem("userName") || "",
    userId: localStorage.getItem("userId") || "",
    history: {},
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
    history(state) {
      return state.history;
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
    setHistory(state, history) {
      state.history = history;
      localStorage.setItem("history", JSON.stringify(history));
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

    async loadHistory({ commit, state }) {
      var tempHistory = {};

      try {
        const request = await axios.get(
          `https://labor3-d60e.restdb.io/rest/transactions?q={"user_id": "${state.userId}"}`,
          {
            headers: {
              "x-apikey": "64a2e9bc86d8c525a3ed8f63",
            },
          }
        );
        if (request.status === 201 || request.status === 200) {
          alert("Datos Cargados Exitosamente");
          tempHistory = request.data;
          for (const historyData of tempHistory) {
            if (historyData.action === "purchase") {
              historyData.action = "Compra";
            } else if (historyData.action === "sale") {
              historyData.action = "Venta";
            }
          }
          /* console.log("Historial Temporal: ", tempHistory); */
          commit("setHistory", tempHistory);
        }
      } catch (error) {
        console.log("Error al cargar el historial", error);
      }
    },

    async editHistory({ commit, state }, payload) {
      const historyId = payload.movimentId;
      const newMoney = payload.newMount;
      var newAmount = 0;

      var tempHistory = {
        crypto_amount: 0,
        money: 0,
      };

      for (const moviment of state.history) {
        if (moviment._id === historyId) {
          console.log("Se encontro el historial relacionado");
          var originalAmount = parseFloat(moviment.crypto_amount);
          var originalMoney = parseFloat(moviment.money);

          var unitPrice = originalMoney / originalAmount;
          console.log("Nueva moneda", newMoney);
          newAmount = parseFloat(newMoney) / unitPrice;

          console.log("Nuevo monto:", newAmount);
          tempHistory = {
            crypto_amount: newAmount,
            money: newMoney,
          };
        }
      }
      console.log("Historial antes de entrar al try: ", tempHistory);

      try {
        const request = await axios.patch(
          `https://labor3-d60e.restdb.io/rest/transactions/${historyId}`,
          tempHistory,
          {
            headers: {
              "x-apikey": "64a2e9bc86d8c525a3ed8f63",
            },
          }
        );
        if (request.status === 200 || request.status === 201) {
          commit("setHistory", tempHistory);
        }
      } catch (error) {
        console.log("error en el patch:", error);
      }
    },

    async loadWallet({ commit, state, dispatch }) {
      await dispatch("loadHistory");

      const tempWallet = {
        ars: state.wallet.ars,
        cryptos: {},
      };

      for (const transactions of state.history) {
        if (transactions.action === "Compra") {
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
        } else if (transactions.action === "Venta") {
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
    },

    logOut({ commit }) {
      commit("setUser", { userName: "", userId: "" });
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");
    },
  },
};
