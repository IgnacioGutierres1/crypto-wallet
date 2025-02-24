<template>
  <!-- Wallet View Section -->
  <div class="wallet-view">
    <h1 class="wallet-view__title">Wallet</h1>
    <h3 class="wallet-view__balance">
      Saldo Actual: $
      {{ parseFloat(balance.toFixed(2)).toLocaleString("es-AR") }}
    </h3>

    <!-- Portfolio Section -->

    <div class="wallet-view__portfolio">
      <h3 class="wallet-view__portfolio-title">Portfolio</h3>
      <table class="wallet-view__portfolio-table">
        <thead>
          <tr>
            <th class="wallet-view__portfolio-column-header">Criptomoneda</th>
            <th class="wallet-view__portfolio-column-header">Cantidad</th>
            <th class="wallet-view__portfolio-column-header">Balance Actual</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="portfolio-row-coins"
            v-for="(cryptoAmount, crypto) in portfolio"
            :key="crypto"
          >
            <td class="wallet-view__portfolio-cell">{{ crypto }}</td>
            <td class="wallet-view__portfolio-cell">{{ cryptoAmount }}</td>
            <td class="wallet-view__portfolio-cell">
              $
              {{
                parseFloat(
                  updateBalance(cryptoAmount, crypto).toFixed(2)
                ).toLocaleString("es-AR")
              }}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="portfolio-row-total">
            <td class="wallet-view__portfolio-cell"><strong>Total</strong></td>
            <td class="wallet-view__portfolio-cell"></td>
            <td class="wallet-view__portfolio-cell">
              $
              {{
                parseFloat(totalPortfolioBalance.toFixed(2)).toLocaleString(
                  "es-AR"
                )
              }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Portfolio Section ENDS -->

    <!-- Investments Analysis Section -->

    <div class="wallet-view__investments">
      <h3 class="wallet-view__investments-title">Analisis de Inversiones</h3>
      <table class="wallet-view__investments-table">
        <thead>
          <tr>
            <th class="wallet-view__investments-column-header">Criptomoneda</th>
            <th class="wallet-view__investments-column-header">Resultado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="investments-row-analysis"
            v-for="(result, coin) in investmentsAnalysis"
            :key="coin"
          >
            <td class="wallet-view__investments-cell">{{ coin }}</td>
            <td class="wallet-view__investments-cell">$ {{ result }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Investments Analysis Section ENDS -->

    <!-- History Section -->

    <div class="wallet-view__history">
      <h3 class="wallet-view__history-title">Historial</h3>
      <table class="wallet-view__history-table">
        <thead>
          <tr>
            <th class="wallet-view__history-column-header">Criptomoneda</th>
            <th class="wallet-view__history-column-header">Operacion</th>
            <th class="wallet-view__history-column-header">Cantidad</th>
            <th class="wallet-view__history-column-header">Monto</th>
            <th class="wallet-view__history-column-header">Fecha</th>
            <th class="wallet-view__history-column-header">Editar o Borrar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="history-row"
            v-for="(historyData, history) in history"
            :key="history"
          >
            <td class="wallet-view__history-cell">
              {{ historyData.crypto_code }}
            </td>
            <td class="wallet-view__history-cell">{{ historyData.action }}</td>
            <td class="wallet-view__history-cell">
              {{ historyData.crypto_amount }}
            </td>
            <td class="wallet-view__history-cell">
              $ {{ historyData.money.toLocaleString("es-AR") }}
            </td>
            <td class="wallet-view__history-cell">
              {{ historyData.datetime }}
            </td>
            <td class="wallet-view__history-cell">
              <button
                class="wallet-view__history-button"
                @click="
                  openEditModal(
                    historyData._id,
                    historyData.action,
                    historyData.crypto_amount,
                    historyData.money
                  )
                "
              >
                Editar</button
              ><button
                class="wallet-view__history-button"
                @click="openDeleteModal(historyData._id)"
              >
                Borrar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- History Section ENDS -->

    <!-- Edit Moviment Modal Section -->

    <div v-if="modalEdit" class="wallet-view__editmodal">
      <a
        class="wallet-view__editmodal-closebutton"
        @click="openCloseModal('edit')"
        >X</a
      >
      <h3 class="wallet-view__editmodal-title">Editar Movimiento</h3>
      <p>Ingresar monto:</p>
      <p>{{ message }}</p>
      <input type="number" v-model="newAmount" />
      <div class="wallet-view__editmodal-buttons">
        <button class="wallet-view__editmodal-button" @click="editMoviment">
          Aceptar
        </button>
        <button
          class="wallet-view__editmodal-button"
          @click="openCloseModal('edit')"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Edit Moviment Modal Section ENDS -->

    <!-- Delete Moviment Modal Section -->

    <div v-if="modalDelete" class="wallet-view__deletemodal">
      <a
        class="wallet-view__deletemodal-closebutton"
        @click="openCloseModal('delete')"
        >X</a
      >
      <h3 class="wallet-view__deletemodal-title">Borrar Movimiento</h3>
      <p>Desea Eliminar el movimiento?</p>
      <p>{{ message }}</p>
      <div class="wallet-view__deletemodal-buttons">
        <button class="wallet-view__deletemodal-button" @click="deleteMoviment">
          Si
        </button>
        <button
          class="wallet-view__deletemodal-button"
          @click="openCloseModal('delete')"
        >
          No
        </button>
      </div>
    </div>

    <!-- Delete Moviment Modal Section ENDS -->
  </div>
  <!-- Wallet View ENDS -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "WalletView",
  data() {
    return {
      modalEdit: false,
      message: "",
      action: "",
      modalDelete: false,
      movimentId: "",
      newAmount: 0,
      originalCryptoAmount: 0,
      originalMoneyAmount: 0,
    };
  },
  methods: {
    ...mapActions("user", ["loadPortfolio", "editHistory", "deleteHistory"]),
    openCloseModal(modalType) {
      this.message = "";
      if (modalType === "edit") {
        this.modalEdit = !this.modalEdit;
      }
      if (modalType === "delete") {
        this.modalDelete = !this.modalDelete;
      }
    },
    openEditModal(
      movimentId,
      action,
      pOriginalCryptoAmount,
      pOriginalMoneyAmount
    ) {
      this.openCloseModal("edit");
      this.movimentId = movimentId;
      this.action = action;
      this.originalCryptoAmount = pOriginalCryptoAmount;
      this.originalMoneyAmount = pOriginalMoneyAmount;
      console.log("monto", this.originalMoneyAmount);
    },
    async editMoviment() {
      if (this.newAmount > 0) {
        if (
          this.action === "Compra" &&
          this.newAmount < this.originalMoneyAmount
        ) {
          this.message = await this.editHistory({
            movimentId: this.movimentId,
            originalCryptoAmount: this.originalCryptoAmount,
            originalMoneyAmount: this.originalMoneyAmount,
            newAmount: this.newAmount,
            action: this.action,
          });
        } else {
          this.message = "El monto para editar una compra debe ser menor";
        }
      }
    },
    openDeleteModal(movimentId) {
      this.modalDelete = !this.modalDelete;
      this.movimentId = movimentId;
    },
    async deleteMoviment() {
      console.log("Id a eliminar:", this.movimentId);
      this.message = await this.deleteHistory(this.movimentId);
    },
  },
  computed: {
    ...mapGetters("user", ["history", "balance", "portfolio"]),
    ...mapGetters("cryptostore", [
      "updateBalance",
      "totalPortfolioBalance",
      "investmentsAnalysis",
    ]),
  },
  async mounted() {
    this.loadPortfolio();
  },
};
</script>

<style scoped>
/* --- Wallet Styles --- */

.wallet-view {
  display: flex;
  width: 90vw;
  min-height: 50vh;
  margin: 0 auto;
  flex-direction: column;
}

.wallet-view__title {
  align-self: center;
  width: 85%;
  padding: 0 0 20px 0;
  border-bottom: 5px solid;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    #0009 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

.wallet-view__balance {
  display: flex;
  justify-content: start;
  width: 100%;
  margin: 20px 0;
}

/* --- Wallet Styles ENDS --- */

/* --- Portfolio Styles --- */

.wallet-view__portfolio {
  display: flex;
  margin: 20px 15px;
  padding: 10px;
  min-height: 20vh;
  width: 50%;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-self: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 10px;
}

.wallet-view__portfolio-table {
  width: 100%;
  margin: 10px;
  table-layout: fixed;
  border-collapse: collapse;
}

.wallet-view__portfolio-column-header {
  padding: 8px 10px;
}

.wallet-view__portfolio-cell {
  padding: 5px;
}

.portfolio-row-total {
  border-top: 1px solid black;
}

/* --- Portfolio Styles ENDS --- */

/* --- Investments Analysis Styles --- */

.wallet-view__investments {
  display: flex;
  margin: 20px 15px;
  padding: 10px;
  min-height: 20vh;
  width: 50%;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-self: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 10px;
}

.wallet-view__investments-table {
  width: 100%;
  margin: 10px;
  table-layout: fixed;
  border-collapse: collapse;
}

.wallet-view__investments-column-header {
  padding: 8px 10px;
}

.wallet-view__investments-cell {
  padding: 5px;
}

/* --- Investments Analysis Styles ENDS --- */

/* --- History Styles --- */

.wallet-view__history {
  display: flex;
  margin: 20px 15px 80px 15px;
  padding: 10px 4px;
  min-height: 20vh;
  width: 100%;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-self: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 10px;
}

.wallet-view__history-table {
  width: 100%;
  margin: 10px;
  table-layout: fixed;
  border-collapse: collapse;
}

.wallet-view__history-column-header {
  padding: 8px 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.wallet-view__history-cell {
  padding: 5px;
  width: 100%;
  border-bottom: 1px solid black;
}

.wallet-view__history-button {
  margin: 5px;
  padding: 5px 5px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
  cursor: pointer;
}

/* --- History Styles ENDS --- */

/* --- Edit Moviment Modal Styles --- */

.wallet-view__editmodal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-self: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  position: fixed;
  height: 40%;
  width: 30%;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.wallet-view__editmodal-closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

.wallet-view__editmodal-buttons {
  display: flex;
  gap: 8px;
}

.wallet-view__editmodal-button {
  margin: 5px;
  padding: 5px 5px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
  cursor: pointer;
}

/* --- Edit Moviment Modal Styles ENDS --- */

/* --- Delete Moviment Modal Styles --- */

.wallet-view__deletemodal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-self: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  position: fixed;
  height: 40%;
  width: 30%;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.wallet-view__deletemodal-closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

.wallet-view__deletemodal-buttons {
  display: flex;
  gap: 8px;
}

.wallet-view__deletemodal-button {
  margin: 5px;
  padding: 5px 5px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
  cursor: pointer;
}

/* --- Delete Moviment Modal Styles ENDS --- */
</style>
