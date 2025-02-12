<template>
  <h1>Wallet</h1>
  <div class="main-container">
    <h2>Saldo Actual:</h2>
    <strong>$ {{ wallet.ars.toLocaleString("es-AR") }}</strong>
    <button @click="cargarDatos">Cargar Datos</button>
    <div>
      <h3>Portfolio</h3>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cryptoAmount, crypto) in wallet.cryptos" :key="crypto">
            <td>{{ crypto }}</td>
            <td>{{ cryptoAmount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="history-container">
      <table></table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "WalletView",
  data() {
    return {};
  },
  methods: {
    ...mapActions("user", ["loadWallet"]),
    cargarDatos() {
      this.loadWallet();
    },
  },
  computed: {
    ...mapGetters("user", ["wallet"]),
  },
};
</script>
