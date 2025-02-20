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
    updatePortfolioBalance(state) {
      return function (crypto_amount, coin) {
        const portfolioBalance =
          parseFloat(crypto_amount) *
          parseFloat(state.cryptos["ripio"][coin].price);
        return portfolioBalance;
      };
    },
    totalPortfolioBalance(state, getters, rootState) {
      var total = 0;

      for (var coin in rootState.user.user.portfolio) {
        total += getters.updatePortfolioBalance(
          rootState.user.user.portfolio[coin],
          coin
        );
        /* parseFloat(rootState.user.user.portfolio[coin]) *
          parseFloat(state.cryptos["ripio"][coin].price); */
      }
      return total;
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
    /* async updatePortfolioBalance({ state, dispatch }, payload) {
      await dispatch("fetchCryptos");
      const portfolioBalance =
        parseFloat(payload.crypto_amount) *
        parseFloat(state.cryptos["ripio"][payload.coin].price);
      return portfolioBalance;
    }, */
    /* async fetchCryptos({ commit }) {
      let cryptoData = {};
      let coins = ["BTC", "ETH", "USDT", "USDC", "DAI", "UXD"];
      let exchanges = ["binance", "bybit", "satoshitango", "ripio"];

      try {
        let promises = [];
        for (const exchange of exchanges) {
          cryptoData[exchange] = {};
          for (const coin of coins) {
            let request = axios
              .get(`https://criptoya.com/api/${exchange}/${coin}/ARS`)
              .then((response) => {
                cryptoData[exchange][coin] = { price: response.data.totalBid };
              })
              .catch((error) => {
                console.warn(`Error obteniendo ${coin} en ${exchange}:`, error);
                delete cryptoData[exchange][coin];
              });

            promises.push(request);
          }
        }
        await Promise.all(promises);
        commit("setCryptos", cryptoData);
      } catch (error) {
        console.error("Error en fetchCryptos:", error);
      }
      }, */
  },
};
