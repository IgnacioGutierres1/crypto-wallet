import axios from "axios";

export default {
  namespaced: true,
  state: {
    user: JSON.parse(localStorage.getItem("user")) || {
      userName: "",
      userId: "",
      balance: 0,
      portfolio: {},
    },
    history: {},
    login: false,
  },
  getters: {
    user(state) {
      return state.user;
    },
    userName(state) {
      return state.user.userName;
    },
    userId(state) {
      return state.user.userId;
    },
    balance(state) {
      return state.user.balance;
    },
    portfolio(state) {
      return state.user.portfolio;
    },
    history(state) {
      return state.history;
    },
    login(state) {
      return state.user.userId !== "" && state.user.userId !== null;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    setBalance(state, balance) {
      state.user.balance = parseFloat(balance);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setPortfolio(state, { crypto, amount }) {
      if (!state.user.portfolio[crypto]) {
        state.user.portfolio[crypto] = amount;
      } else {
        state.user.portfolio[crypto] = state.user.portfolio[crypto] + amount;
      }
      if (
        state.user.portfolio[crypto] === 0 ||
        state.user.portfolio[crypto] === undefined
      ) {
        delete state.user.portfolio[crypto];
      }
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    setHistory(state, history) {
      state.history = history;
    },
  },
  actions: {
    saveUser({ commit, state }, userName) {
      var tempUsers = localStorage.getItem("users");
      var usersSaved = {};
      var msg = "";

      if (tempUsers !== null) {
        usersSaved = JSON.parse(tempUsers);
      }

      if (usersSaved[userName]) {
        commit("setUser", {
          userName: userName,
          userId: usersSaved[userName],
          balance: state.user.balance || 0,
          portfolio: state.user.portfolio || {},
        });
        msg = "Usuario Encontrado ✅";
      } else {
        const alphanumericId = Math.random().toString(36).slice(2, 12);
        usersSaved[userName] = alphanumericId;
        localStorage.setItem("users", JSON.stringify(usersSaved));
        commit("setUser", {
          userName: userName,
          userId: alphanumericId,
          balance: 0,
          portfolio: {},
        });
        msg = "Se ha iniciado sesión ✅";
      }
      return msg;
    },

    logOut({ commit }) {
      commit("setUser", {
        userName: "",
        userId: "",
        balance: 0,
        portfolio: {},
      });
      localStorage.removeItem("user");
    },

    editBalance({ commit, state }, payload) {
      var newBalance = parseFloat(state.user.balance);
      var msg = "";
      if (payload.action === "deposit") {
        newBalance += payload.amount;
        msg = `Se ingreso correctamente $${payload.amount} ✅`;
      }
      if (payload.action === "withdraw") {
        newBalance -= payload.amount;
        msg = `Se extrajo correctamente $${payload.amount} ✅`;
      }
      commit("setBalance", newBalance);
      console.log("Nuevo Balance: ", newBalance);
      return msg;
    },

    async postOperation({ commit, state }, payload) {
      console.log("Objeto antes de data", payload);
      var newBalance;
      const postRequestData = {
        user_id: payload.userId,
        action: payload.action,
        crypto_code: payload.coin,
        crypto_amount: payload.amount,
        money: payload.money,
        datetime: payload.datetime,
      };
      console.log("Objeto Recibido: ", postRequestData);
      try {
        const apiClient = await axios.post(
          "https://laboratorio3-5459.restdb.io/rest/transactions",
          postRequestData,
          {
            headers: {
              "x-apikey": "64a57c2b86d8c50fe6ed8fa5",
            },
          }
        );
        console.log("respuesta de la api:", apiClient);
        if (apiClient.status === 200 || apiClient.status == 201) {
          if (payload.operation === "Compra") {
            newBalance = state.user.balance;
            newBalance -= postRequestData.money;
            console.log("Nuevo Balance", newBalance);
            commit("setBalance", newBalance);
            commit("setPortfolio", {
              crypto: postRequestData.crypto_code,
              amount: parseFloat(postRequestData.crypto_amount),
            });
          } else if (payload.operation === "Venta") {
            newBalance = state.user.balance;
            newBalance += postRequestData.money;
            console.log("Nuevo Balance", newBalance);
            commit("setBalance", newBalance);
            commit("setPortfolio", {
              crypto: postRequestData.crypto_code,
              amount: parseFloat(
                -postRequestData.crypto_amount
              ) /* Menos para que se reste */,
            });
          }
          alert(`${payload.operation} Exitosa`);
          return apiClient.data;
        }
      } catch (error) {
        console.error("Error en el post", error);
        alert(`Error en la ${payload.operation} `);
      }
    },

    async loadHistory({ commit, state }) {
      var newHistory = {};

      try {
        const request = await axios.get(
          `https://laboratorio3-5459.restdb.io/rest/transactions?q={"user_id": "${state.user.userId}"}`,
          {
            headers: {
              "x-apikey": "64a57c2b86d8c50fe6ed8fa5",
            },
          }
        );
        if (request.status === 201 || request.status === 200) {
          newHistory = request.data;
          for (var key in newHistory) {
            var historyData = newHistory[key];
            if (historyData.action === "purchase") {
              historyData.action = "Compra";
            } else if (historyData.action === "sale") {
              historyData.action = "Venta";
            }
          }
          console.log("Historial Temporal: ", newHistory);
          commit("setHistory", newHistory);
        }
      } catch (error) {
        console.log("Error al cargar el historial", error);
      }
    },

    async editHistory({ commit, state, dispatch }, payload) {
      var unitPrice =
        parseFloat(payload.originalMoneyAmount) /
        parseFloat(payload.originalCryptoAmount);
      var newAmount = parseFloat(payload.newAmount) / unitPrice;
      const moneyDifference =
        parseFloat(payload.originalMoneyAmount) - parseFloat(payload.newAmount);
      var newBalance;

      var newMoviment = {
        crypto_amount: newAmount,
        money: parseFloat(payload.newAmount),
      };

      if (payload.action === "Compra") {
        newBalance = state.user.balance + moneyDifference;
      } else if (payload.action === "Venta") {
        newBalance = state.user.balance - moneyDifference;
      }

      try {
        const request = await axios.patch(
          `https://laboratorio3-5459.restdb.io/rest/transactions/${payload.movimentId}`,
          newMoviment,
          {
            headers: {
              "x-apikey": "64a57c2b86d8c50fe6ed8fa5",
            },
          }
        );
        if (request.status === 200 || request.status === 201) {
          commit("setBalance", newBalance);
          dispatch("loadHistory");
          return "Se edito correctamente ✅";
        }
      } catch (error) {
        console.log("error en el patch:", error);
        return "Ocurrió un error ❌";
      }
    },

    async deleteHistory({ dispatch }, movimentId) {
      try {
        const request = await axios.delete(
          `https://laboratorio3-5459.restdb.io/rest/transactions/${movimentId}`,
          {
            headers: {
              "x-apikey": "64a57c2b86d8c50fe6ed8fa5",
            },
          }
        );
        if (request.status === 200 || request.status === 201) {
          dispatch("loadHistory");
          return "Se elimino correctamente ✅";
        }
      } catch (error) {
        console.log("error en el patch:", error);
        return "Ocurrió un error ❌";
      }
    },

    async loadPortfolio({ commit, state, dispatch }) {
      /* await dispatch("cryptostore/fetchCryptos", { root: true }); */
      await dispatch("loadHistory");

      const tempHistory = state.history;
      var newPortfolio = {};

      for (var key in tempHistory) {
        var transactions = tempHistory[key];
        if (transactions.action === "Compra") {
          if (newPortfolio[transactions.crypto_code]) {
            newPortfolio[transactions.crypto_code] += parseFloat(
              transactions.crypto_amount
            );
          } else {
            newPortfolio[transactions.crypto_code] = parseFloat(
              transactions.crypto_amount
            );
          }
        } else if (transactions.action === "Venta") {
          if (newPortfolio[transactions.crypto_code]) {
            newPortfolio[transactions.crypto_code] -= parseFloat(
              transactions.crypto_amount
            );
          }
        }
      }

      console.log("Portfolio: ", newPortfolio);

      commit("setPortfolio", newPortfolio);
    },
  },
};
