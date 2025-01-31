<template>
  <div class="about">
    <h1>Compra y Venta de CryptoActivos</h1>
  </div>
  <div>
    <select v-model="selectedExchange">
      <option v-for="exchange in exchanges" :key="exchange" :value="exchange">
        {{ exchange }}
      </option>
    </select>
  </div>
  <div>
    <table v-if="selectedExchange">
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Precio (ARS)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coinData, coin) in cryptos[selectedExchange]" :key="coin">
          <td>{{ coin }}</td>
          <td>{{ convertPrice(coinData.price) }}</td>
        </tr>
      </tbody>
    </table>
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
