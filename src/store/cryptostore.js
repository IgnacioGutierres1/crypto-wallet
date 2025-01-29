import axios from "axios";

export default {
  namespaced: true,
  state: {
    cryptos: {},
  },
  getters: {
    getCryptos(state) {
      return state.cryptos;
    },
  },
  mutations: {
    setCryptos(state, cryptos) {
      state.cryptos = cryptos;
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
            let request = axios
              .get(`https://criptoya.com/api/${exchange}/${coin}/ARS`)
              .then((response) => {
                cryptoData[exchange][coin] = { price: response.data.totalBid };
              })
              .catch((error) => {
                console.warn(`Error obteniendo ${coin} en ${exchange}:`, error);
                cryptoData[exchange][coin] = { price: null }; // Fallback en caso de error
              });

            promises.push(request);
          }
        }
        await Promise.all(promises);
        console.log(cryptoData);
        commit("setCryptos", cryptoData);
      } catch (error) {
        console.error("Error en fetchCryptos:", error);
      }
    },
  },
};
