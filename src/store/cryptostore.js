import axios from "axios";

export default {
  namespaced: true,
  state: {
    cryptos: [],
  },
  getters: {
    getCryptos(state) {
      return state.cryptos;
    },
  },
  mutations: {
    setCryptos(state, cryptoData) {
      return (state.cryptos = cryptoData);
    },
  },
  actions: {
    async fetchCryptos({ commit }, { exchange, coins }) {
      try {
        const cryptoData = [];
        for (const coin of coins) {
          const response = await axios.get(
            `https://criptoya.com/api/${exchange}/${coin}/ars/0.1`
          );

          cryptoData.push({
            coin: coin,
            exchange: exchange,
            price: response.data.totalAsk,
          });
        }
        console.log(cryptoData.data), commit("setCryptos", cryptoData);
      } catch (error) {
        console.log("Ocurrio un error", error);
      }
    },
  },
};
