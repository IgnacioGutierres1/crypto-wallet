<template>
  <div class="operations-view">
    <h1 class="operations-view__title">Compra y Venta de CryptoActivos</h1>
    <div class="coin-container">
      <div>
        <select class="coin-container__select" v-model="selectedExchange">
          <option
            v-for="exchange in exchanges"
            :key="exchange"
            :value="exchange"
          >
            {{ exchange }}
          </option>
        </select>
      </div>
      <table class="coin-container__table" v-if="selectedExchange">
        <thead>
          <tr>
            <th class="coin-container__table--th">Criptomoneda</th>
            <th class="coin-container__table--th">Precio (ARS)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="coin-container__table--trcoins"
            v-for="(coinData, coin) in cryptos[selectedExchange]"
            :key="coin"
          >
            <td class="coin-container__table--td">{{ coin }}</td>
            <td class="coin-container__table--td">
              {{ convertPrice(coinData.price) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "OperationsView",
  data() {
    return {
      selectedExchange: "",
    };
  },
  methods: {
    ...mapActions("cryptostore", ["fetchCryptos"]),
    convertPrice(defaultPrice) {
      if (defaultPrice !== null && defaultPrice !== undefined) {
        return "$ " + defaultPrice.toLocaleString("es-AR");
      }
    },
  },
  computed: {
    ...mapGetters("cryptostore", ["cryptos", "exchanges"]),
    getCryptos() {
      return this.cryptos;
    },
  },
  async mounted() {
    await this.fetchCryptos();
    if (this.exchanges.lenght > 0) {
      this.selectedExchange = this.exchanges[0];
    }
  },
};
</script>

<style scoped>
.operations-view {
  display: flex;
  width: 80vw;
  min-height: 50vh;
  margin: 0 auto;
  flex-direction: column;
}

.coin-container {
  display: flex;
  margin: 15px;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.coin-container__select {
  margin: 5px;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 215px;
}

.coin-container__table {
  width: 60%;
  margin: 10px;
  table-layout: fixed;
  border-collapse: collapse;
}

.coin-container__table--th {
  padding: 8px 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.coin-container__table--td {
  padding: 12px 5px;
  border-bottom: 1px solid black;
}

.coin-container__table--trcoins:hover {
  background-color: #0001;
  cursor: pointer;
}
</style>
