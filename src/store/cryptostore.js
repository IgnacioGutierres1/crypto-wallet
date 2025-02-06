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
    async postOperation(consulta) {
      console.log("Objeto antes de data", consulta);
      const operaciondata = {
        user_id: consulta.userId,
        action: consulta.action,
        crypto_code: consulta.coin,
        crypto_amount: consulta.amount,
        money: consulta.money,
        datetime: consulta.datetime,
        operacion: consulta.operacion,
      };
      console.log("Objeto Recibido: ", operaciondata);
      try {
        const apiClient = await axios.post(
          "https://laboratorio3-f36a.restdb.io/rest/transactions",
          operaciondata,
          {
            headers: {
              "x-apikey": "60eb09146661365596af552f",
            },
          }
        );
        console.log("respuesta de la api:", apiClient);
        if (apiClient.status === 200 || apiClient.status == 201) {
          alert(`${consulta.operacion} Exitosa`);
        }
        return apiClient.data;
      } catch (error) {
        console.error("Error en el post", error);
        alert(`Error en la ${consulta.operacion} `);
      }
    },
    metodoPrueba(alfanumerico) {
      console.log(alfanumerico);
    },
  },
};
