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
        console.log(cryptoData);
        commit("setCryptos", cryptoData);
      } catch (error) {
        console.error("Error en fetchCryptos:", error);
      }
    },
  },
  async postOperation(userId, action, coin, amount, money) {
    try {
      const datetime = new Date().toISOString();

      const apiClient = await axios.post(
        "https://laboratorio3-f36a.restdb.io/rest",
        {
          user_id: userId,
          action: action,
          crypto_code: coin,
          crypto_amount: amount,
          money: money,
          datetime: datetime,
        },
        {
          headers: {
            "x-apikey": "60eb09146661365596af552f",
            "Content-Type": "application/json",
          },
        }
      );
      return apiClient.data;
    } catch (error) {
      console.error("Error en el post", error);
    }
  },
};
