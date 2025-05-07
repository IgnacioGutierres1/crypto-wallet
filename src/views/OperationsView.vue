<template>
  <!-- Operations View Section -->

  <div class="operations-view">
    <h1 class="operations-view__title">Compra y Venta de CryptoActivos</h1>

    <!-- Coins Section -->

    <div class="operations-view__coins">
      <!-- Exchanges Select Section -->

      <div class="operations-view__coins-header">
        <select
          class="operations-view__coins-select"
          v-model="selectedExchange"
        >
          <option
            v-for="exchange in exchanges"
            :key="exchange"
            :value="exchange"
          >
            {{ exchange }}
          </option>
        </select>
      </div>
      <!-- Exchanges Select Section ENDS -->

      <!-- Coins Table Section -->

      <table class="operations-view__coins-table" v-if="selectedExchange">
        <thead>
          <tr>
            <th class="operations-view__coins-column-header">Criptomoneda</th>
            <th class="operations-view__coins-column-header">Precio (ARS)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="coins-row"
            v-for="(coinData, coin) in cryptos[selectedExchange]"
            :key="coin"
            @click="openModal(coin, coinData.price)"
          >
            <td class="operations-view__coins-cell">{{ coin }}</td>
            <td class="operations-view__coins-cell">
              {{ convertPrice(coinData.price) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Coins Table Section ENDS -->

      <!-- Coins Modal Section -->

      <div v-if="coinClicked" class="operations-view__coinsmodal">
        <a @click="closeModal" class="operations-view__coinsmodal-closebutton"
          >X</a
        >
        <h2>{{ selectedCoin }}</h2>
        <p>Precio: {{ convertPrice(selectedPrice) }}</p>
        <p>
          Dinero disponible: $
          {{ parseFloat(balance.toFixed(2)).toLocaleString("es-AR") }}
        </p>
        <p>
          Cantidad de {{ selectedCoin }} disponible:
          {{ portfolio[selectedCoin] }}
        </p>
        <input
          type="number"
          v-model="moneyQuantity"
          placeholder="Monto a gastar"
          step="0.01"
        />
        <p>
          Cantidad de {{ selectedCoin }}:
          {{ cryptoQuantity() }}
        </p>
        <div class="operations-view__coinsmodal-buttons">
          <button class="operations-view__coinsmodal-button" @click="buy">
            Comprar
          </button>
          <button class="operations-view__coinsmodal-button" @click="sell">
            Vender
          </button>
        </div>
      </div>

      <!-- Coins Modal Section ENDS -->
    </div>
  </div>

  <!-- Operation View Section ENDS -->
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
      moneyQuantity: 0,
    };
  },
  methods: {
    ...mapActions("cryptostore", ["fetchCryptos"]),
    ...mapActions("user", ["postOperation"]),
    convertPrice(defaultPrice) {
      if (defaultPrice) {
        return "$ " + defaultPrice.toLocaleString("es-AR");
      } else {
        return "-";
      }
    },
    openModal(coin, price) {
      this.selectedCoin = coin;
      this.selectedPrice = price;
      this.coinClicked = true;
    },

    cryptoQuantity() {
      if (this.moneyCheck() !== null && !isNaN(this.moneyCheck())) {
        return parseFloat(this.moneyCheck() / this.selectedPrice).toFixed(22);
      } else {
        return "";
      }
    },

    moneyCheck() {
      if (this.moneyQuantity > 0) {
        return this.moneyQuantity;
      }
    },

    buy() {
      if (this.moneyCheck() === null) {
        return;
      }

      if (this.moneyCheck() <= this.balance) {
        try {
          const response = this.postOperation({
            userId: this.getUserId,
            action: "purchase",
            coin: this.selectedCoin,
            amount: this.cryptoQuantity(),
            money: this.moneyCheck(),
            datetime: new Date().toISOString(),
            operation: "Compra",
          });
          if (response.status === 201 || response.status === 200) {
            console.log("Operacion exitosa despues del POST");
          }
        } catch (error) {
          console.log("Ocurrio un error en la operacion");
        }
      }
    },

    sell() {
      if (this.moneyCheck() === null) {
        return;
      }

      if (this.cryptoQuantity() < this.portfolio[this.selectedCoin]) {
        try {
          const response = this.postOperation({
            userId: this.getUserId,
            action: "sale",
            coin: this.selectedCoin,
            amount: this.cryptoQuantity(),
            money: this.moneyCheck(),
            datetime: new Date().toISOString(),
            operation: "Venta",
          });
          if (response.status === 201 || response.status === 200) {
            console.log("Operacion exitosa despues del POST");
          }
        } catch (error) {
          console.log("Ocurrio un error en la operacion");
        }
      }
    },

    closeModal() {
      this.coinClicked = false;
      this.moneyQuantity = "";
    },
  },
  computed: {
    ...mapGetters("cryptostore", ["cryptos", "exchanges"]),
    ...mapGetters("user", ["userName", "userId", "balance", "portfolio"]),
    getUserId() {
      return this.userId;
    },
  },
  async mounted() {
    try {
      await this.fetchCryptos();
      if (this.exchanges.length > 0) {
        this.selectedExchange = this.exchanges[0];
      } else {
        this.selectedExchange = "";
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  },
};
</script>

<style scoped>
/* --- Operations View Styles --- */

.operations-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.operations-view__title {
  align-self: center;
  padding-bottom: 20px;
  width: 100%;
  min-width: 430px;
  border-bottom: 5px solid;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    var(--color-line-decoration) 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

/* --- Operations View Styles ENDS --- */

/* --- Coins Styles --- */

.operations-view__coins {
  display: flex;
  margin: 15px;
  padding: 18px 22px;
  min-height: 50vh;
  min-width: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: var(--color-sections-bg);
  border-radius: 10px;
}

/* --- Exchanges Select Styles --- */

.operations-view__coins-header {
  width: 61%;
  display: flex;
  justify-content: start;
}

.operations-view__coins-select {
  display: flex;
  margin: 10px;
  padding: 8px;
  align-self: start;
  justify-self: start;
  color: var(--color-font);
  background-color: var(--color-main-bg);
  outline: none;
  border: 1px solid var(--color-button-bg);
}

/* --- Exchanges Select Styles ENDS --- */

/* --- Coins Table Styles --- */

.operations-view__coins-table {
  width: 60%;
  min-width: 300px;
  margin: 10px;
  table-layout: fixed;
  border-collapse: collapse;
  color: var(--color-font);
}

.operations-view__coins-column-header {
  padding: 8px 10px;
  border-top: 1px solid var(--color-tableborder);
  border-bottom: 1px solid var(--color-tableborder);
}

.coins-row:hover {
  background-color: #00000075;
  cursor: pointer;
}

.operations-view__coins-cell {
  padding: 12px 5px;
  border-bottom: 1px solid var(--color-tableborder);
}

/* --- Coins Table Styles ENDS--- */

/* --- Coins Modal Styles --- */

.operations-view__coinsmodal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  width: 30%;
  height: 70%;
  background-color: var(--color-modal-bg);
  border-radius: 10px;
}

.operations-view__coinsmodal-closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

.operations-view__coinsmodal-button {
  margin: 5px;
  padding: 10px 8px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
  cursor: pointer;
}

/* --- Coins Modal Styles ENDS --- */

/* --- Coins Styles ENDS --- */
</style>
