<template>
  <div class="about">
    <h1>Compra y Venta de CryptoActivos</h1>
  </div>
  <div>
    <table>
      <thead>
        <tr>
          <th>Exchange</th>
          <th>Criptomoneda</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(coins, exchange) in getCryptosData" :key="exchange">
          <template v-for="(coinData, coin) in coins" :key="coin">
            <tr>
              <td>{{ exchange }}</td>
              <td>{{ coin }}</td>
              <td>{{ coinData.price }}</td>
            </tr>
          </template>
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
    return {};
  },
  methods: {
    ...mapActions("cryptostore", ["fetchCryptos"]),
  },
  computed: {
    ...mapGetters("cryptostore", ["getCryptos"]),
    getCryptosData() {
      return this.getCryptos;
    },
  },
  mounted() {
    this.fetchCryptos();
  },
};
</script>
