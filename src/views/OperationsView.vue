<template>
  <!-- Main Container -->
  <div class="operations-view">
    <h1 class="operations-view__title">Compra y Venta de CryptoActivos</h1>
    <!-- Coin Container -->
    <div class="coin-container">
      <!-- Exchanges Select -->
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
      <!-- Exchanges Select ENDS -->
      <!-- Coin Table Container -->
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
            @click="openModal(coin, coinData.price)"
          >
            <td class="coin-container__table--td">{{ coin }}</td>
            <td class="coin-container__table--td">
              {{ convertPrice(coinData.price) }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Coin Table Container ENDS -->
      <!-- Coin Modal Window -->
      <div v-if="coinClicked" class="coin-container__modal">
        <a @click="closeModal" class="coin-container__modal--closebutton">X</a>
        <h2>{{ selectedCoin }}</h2>
        <p>Precio: {{ convertPrice(selectedPrice) }}</p>
        <input type="number" v-model="amount" placeholder="Monto a gastar" />
        <div class="coin-container__modal--buttons">
          <button class="coin-container__modal--button" @click="buy">
            Comprar
          </button>
          <button class="coin-container__modal--button" @click="sell">
            Vender
          </button>
        </div>
      </div>
      <!-- Coin Modal Window ENDS -->
    </div>
  </div>
  <!-- Main Container ENDS -->
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "OperationsView",
  data() {
    return {
      selectedExchange: "",
      coinClicked: false,
      selectedCoin: "",
      selectedPrice: 0,
      amount: "",
    };
  },
  methods: {
    ...mapActions("cryptostore", ["fetchCryptos"]),
    convertPrice(defaultPrice) {
      if (defaultPrice !== null && defaultPrice !== undefined) {
        return "$ " + defaultPrice.toLocaleString("es-AR");
      }
    },
    openModal(coin, price) {
      this.selectedCoin = coin;
      this.selectedPrice = price;
      this.coinClicked = true;
    },
    closeModal() {
      this.coinClicked = false;
      this.amount = "";
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
    if (this.exchanges.length > 0) {
      this.selectedExchange = this.exchanges[0];
    }
  },
};
</script>

<style scoped>
/* --- Operations Main Styles Section --- */
.operations-view {
  display: flex;
  width: 80vw;
  min-height: 50vh;
  margin: 0 auto;
  flex-direction: column;
}
/* --- Operations Main Styles Section ENDS --- */

/* --- Coin Container Styles Section --- */
.coin-container {
  display: flex;
  margin: 15px;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
/* --- Exchanges Select Styles Section --- */

.coin-container__select {
  margin: 5px;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 215px;
}

/* --- Exchanges Select Styles Section --- */

/* --- Coin Table Styles Section --- */

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
/* --- Coin Table Styles Section ENDS--- */

/* --- Modal Styles Section --- */
.coin-container__modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  width: 30%;
  height: 70%;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.coin-container__modal--button {
  margin: 10px;
  padding: 8px 5px;
}

.coin-container__modal--closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

/* --- Coin Container Styles Section ENDS --- */
</style>
