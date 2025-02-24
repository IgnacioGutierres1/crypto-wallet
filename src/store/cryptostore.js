import axios from "axios";

export default {
  namespaced: true,
  state: {
    cryptos: {},
  },
  getters: {
    cryptos(state) {
      return state.cryptos;
    },
    exchanges(state) {
      return Object.keys(state.cryptos);
    },
    updateBalance(state) {
      return function (crypto_amount, coin) {
        const newBalance =
          parseFloat(crypto_amount) *
          parseFloat(state.cryptos["ripio"][coin].price);

        return newBalance;
      };
    },
    totalPortfolioBalance(state, getters, rootState) {
      var total = 0;

      for (var coin in rootState.user.user.portfolio) {
        total += getters.updateBalance(
          rootState.user.user.portfolio[coin],
          coin
        );
      }
      return total;
    },
    investmentsAnalysis(state, getters, rootState) {
      var operationsResults = {};

      for (var key in rootState.user.history) {
        const transaction = rootState.user.history[key];
        const coin = transaction.crypto_code;
        if (!operationsResults[coin]) {
          operationsResults[coin] = {
            totalPurchase: 0,
            totalSale: 0,
            currentValue: 0,
          };
        }
        if (transaction.action === "Compra") {
          operationsResults[coin].totalPurchase += transaction.money;
        } else if (transaction.action === "Venta") {
          operationsResults[coin].totalSale += transaction.money;
        }
      }
      for (var coin in rootState.user.user.portfolio) {
        const coinAmount = rootState.user.user.portfolio[coin];
        const currentValue = getters.updateBalance(coinAmount, coin);

        if (operationsResults[coin]) {
          operationsResults[coin].currentValue = currentValue;
        }
      }
      var totalAnalysis = {};
      for (var coinI in operationsResults) {
        const result = operationsResults[coinI];
        totalAnalysis[coinI] =
          result.totalSale + result.currentValue - result.totalPurchase;
        if (totalAnalysis[coinI] > 0) {
          totalAnalysis[coinI] = "+" + totalAnalysis[coinI];
        }
      }
      return totalAnalysis;
    },
  },
  mutations: {
    setCryptos(state, cryptoData) {
      state.cryptos = cryptoData;
    },
  },
  actions: {
    async fetchCryptos({ commit }) {
      let cryptoData = {};
      let coins = ["BTC", "ETH", "USDT", "USDC", "DAI", "UXD"];
      let exchanges = ["binance", "bybit", "satoshitango", "ripio"];

      try {
        let promises = [];
        for (const exchange of exchanges) {
          cryptoData[exchange] = {};
          for (const coin of coins) {
            const promise = axios
              .get(`https://criptoya.com/api/${exchange}/${coin}/ARS`)
              .then(function (request) {
                if (request.status === 201 || request.status === 200) {
                  cryptoData[exchange][coin] = { price: request.data.totalBid };
                  promises.push(request);
                }
              })

              .catch(function (error) {
                console.warn(`Error obteniendo ${coin} en ${exchange}:`, error);
                delete cryptoData[exchange][coin];
              });
            promises.push(promise);
          }
        }
        await Promise.all(promises);
        commit("setCryptos", cryptoData);
      } catch (error) {
        console.error("Error en fetchCryptos:", error);
      }
    },
  },
};
