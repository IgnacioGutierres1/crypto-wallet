<template>
  <!-- Operations View Section -->

  <div class="operations-view">
    <!-- Modal Overlay Blur Section -->

    <div v-if="coinClicked" class="modal-overlay"></div>

    <!-- Modal Overlay Blur Section Ends -->

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

      <div v-if="coinClicked" class="operations-view__coinsmodal-overlay">
        <div class="operations-view__coinsmodal">
          <span
            @click="closeModal"
            class="material-symbols-outlined operations-view__coinsmodal-closebutton"
          >
            close
          </span>
          <span class="material-symbols-outlined"> currency_exchange </span>
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
            class="operations-view__coinsmodal-input"
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
              <span
                class="material-symbols-outlined operations-view__coinsmodal-buttonsymbol"
              >
                paid
              </span>
            </button>
            <button class="operations-view__coinsmodal-button" @click="sell">
              Vender
              <span
                class="material-symbols-outlined operations-view__coinsmodal-buttonsymbol"
              >
                sell
              </span>
            </button>
          </div>
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
  /* Se centra debido a que hereda align-items: stretch del contenedor operations-view */
  align-self: start;
  padding-bottom: 20px;
  width: 100%;
  min-width: 430px;
  border-bottom: 5px solid;
  margin-bottom: 15px;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    var(--color-line-decoration) 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

/* --- Operations View Styles Ends --- */

/* --- Modal Overlay Blur Styles ---  */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(1px);
  background-color: #0008;
  z-index: 1000;
}

/* --- Modal Overlay Blur Styles Ends --- */

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

.operations-view__coinsmodal-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  z-index: 1010;
}

.operations-view__coinsmodal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  min-width: 368px;
  width: 30dvw;
  max-width: 378px;
  min-height: 381px;
  height: 70dvh;
  max-height: 390px;
  background-color: var(--color-modal-bg);
  box-shadow: var(--modal-shadow);
  border-radius: 10px;
  z-index: 1010;
}

.operations-view__coinsmodal-closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

.operations-view__coinsmodal-input {
  width: auto;
  color: var(--color-font);
  background-color: rgba(255, 255, 255, 0.014);
  padding: 7px 10px;
  border: 1px solid transparent;
  outline: none;
  border-radius: 5px;
}

.operations-view__coinsmodal-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.operations-view__coinsmodal-button {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin: 5px;
  padding: 10px 8px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
  cursor: pointer;
}

.operations-view__coinsmodal-button:hover {
  background-color: var(--color-buttonselected-bg);
}

.operations-view__coinsmodal-buttonsymbol {
  font-size: 16px;
}

/* --- Coins Modal Styles ENDS --- */

/* --- Coins Styles ENDS --- */
</style>
