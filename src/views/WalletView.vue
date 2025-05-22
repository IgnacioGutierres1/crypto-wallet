<template>
  <!-- Wallet View Section -->
  <div class="wallet-view">
    <!-- Modal Overlay Blur Section -->

    <div v-if="modalEdit || modalDelete" class="modal-overlay"></div>

    <!-- Modal Overlay Blur Section Ends -->

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
            class="wallet-view__portfolio-row-coins"
            v-for="(cryptoAmount, crypto) in portfolio"
            :key="crypto"
          >
            <td class="wallet-view__portfolio-cell">{{ crypto }}</td>
            <td class="wallet-view__portfolio-cell">{{ cryptoAmount }}</td>
            <td
              v-if="updateBalance(cryptoAmount, crypto) != 0"
              class="wallet-view__portfolio-cell"
            >
              $
              {{
                parseFloat(
                  updateBalance(cryptoAmount, crypto).toFixed(2)
                ).toLocaleString("es-AR")
              }}
            </td>
            <td v-else class="wallet-view__portfolio-cell">No Disponible</td>
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

    <!-- Portfolio Section Ends -->

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
            class="wallet-view__investments-row-analysis"
            v-for="(result, coin) in investmentsAnalysis"
            :key="coin"
          >
            <td class="wallet-view__investments-cell">{{ coin }}</td>
            <td class="wallet-view__investments-cell">{{ result }}</td>
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
                @click="openCloseModal('delete', historyData._id)"
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

    <div v-if="modalEdit" class="wallet-view__editmodal-overlay">
      <div class="wallet-view__editmodal">
        <span
          @click="openCloseModal('edit')"
          class="material-symbols-outlined wallet-view__editmodal-closebutton"
        >
          close
        </span>
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
    </div>

    <!-- Edit Moviment Modal Section ENDS -->

    <!-- Delete Moviment Modal Section -->

    <div v-if="modalDelete" class="wallet-view__deletemodal-overlay">
      <div class="wallet-view__deletemodal">
        <span
          @click="openCloseModal('delete')"
          class="material-symbols-outlined wallet-view__deletemodal-closebutton"
        >
          close
        </span>
        <h3 class="wallet-view__deletemodal-title">Borrar Movimiento</h3>
        <p>Desea Eliminar el movimiento?</p>
        <p>{{ message }}</p>
        <div class="wallet-view__deletemodal-buttons">
          <button
            class="wallet-view__deletemodal-button"
            @click="deleteMoviment"
          >
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

    /* --- Modal Methods --- */

    openCloseModal(modalType, movimentId) {
      this.message = "";

      switch (modalType) {
        case "edit":
          this.modalEdit = !this.modalEdit;
          break;

        case "delete":
          if (movimentId === undefined) {
            console.warn("ID del movimiento invalido");
          }
          this.modalDelete = !this.modalDelete;
          this.movimentId = movimentId;
          break;
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

    openDeleteModal(movimentId) {
      this.modalDelete = !this.modalDelete;
      this.movimentId = movimentId;
    },

    /* --- Modal Methods Ends --- */

    /* --- Edit And Delete Methods --- */

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
    async deleteMoviment() {
      console.log("Id a eliminar:", this.movimentId);
      this.message = await this.deleteHistory(this.movimentId);
    },

    /* --- Edit And Delete Methods --- */
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
/* --- Modal Overlay Blur Styles ---  */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 500vh;
  width: 500vw;
  backdrop-filter: blur(1px);
  background-color: #0008;
  z-index: 1000;
}

/* --- Modal Overlay Blur Styles Ends --- */

/* --- Wallet Styles --- */

.wallet-view {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.wallet-view__title {
  align-self: center;
  padding-bottom: 20px;
  margin-bottom: 40px;
  width: 100%;
  border-bottom: 5px solid;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    var(--color-line-decoration) 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

.wallet-view__balance {
  display: flex;
  justify-content: start;
  width: 100%;
  margin: 20px 0;
  white-space: nowrap;
}

/* --- Wallet Styles Ends --- */

/* --- Portfolio Styles --- */

.wallet-view__portfolio {
  display: flex;
  margin: 20px 15px;
  padding: 10px;
  min-height: 135px;
  /* min-width: 450px; */
  width: auto;
  flex-direction: column;
  align-items: center;
  align-self: center;
  border-radius: 20px;
  background-color: var(--color-sections-bg);
}

.wallet-view__portfolio-table {
  width: 100%;
  margin: 10px;
  table-layout: auto;
  border-collapse: collapse;
}

.wallet-view__portfolio-column-header {
  padding: 8px 10px;
  border-top: 1px solid var(--color-tableborder);
  border-bottom: 1px solid var(--color-tableborder);
  white-space: nowrap;
}

.wallet-view__portfolio-row-coins {
  border-bottom: 1px solid var(--color-tableborder);
}

.wallet-view__portfolio-cell {
  padding: 8px 10px;
  white-space: nowrap;
}

.portfolio-row-total {
  border-top: 1px solid black;
}

@media screen and (max-width: 600px) {
  .wallet-view__portfolio {
    align-self: start;
  }
}

/* --- Portfolio Styles Ends --- */

/* --- Investments Analysis Styles --- */

.wallet-view__investments {
  display: flex;
  margin: 20px 15px;
  padding: 10px;
  min-height: 135px;
  min-width: 500px;
  max-width: 550px;
  flex-direction: column;
  align-items: center;
  align-self: center;
  /* justify-self: center; */
  justify-content: center;
  border-radius: 20px;
  background-color: var(--color-sections-bg);
}

.wallet-view__investments-table {
  width: 100%;
  margin: 10px;
  table-layout: auto;
  border-collapse: collapse;
}

.wallet-view__investments-column-header {
  padding: 8px 10px;
  border-top: 1px solid var(--color-tableborder);
  border-bottom: 1px solid var(--color-tableborder);
}

.wallet-view__investments-row-analysis {
  border-top: 1px solid var(--color-tableborder);
}

.wallet-view__investments-cell {
  padding: 8px 10px;
  white-space: nowrap;
}

@media screen and (max-width: 600px) {
  .wallet-view__investments {
    align-self: start;
  }
}

/* --- Investments Analysis Styles Ends --- */

/* --- History Styles --- */

.wallet-view__history {
  display: flex;
  margin: 20px 15px 80px 15px;
  padding: 10px;
  /* min-height: 20vh; */
  min-width: 1060px;
  /* max-width: 1100px; */
  /* width: auto; */
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-self: center;
  justify-content: center;
  border-radius: 20px;
  background-color: var(--color-sections-bg);
}

.wallet-view__history-table {
  width: 100%;
  margin: 10px;
  table-layout: auto;
  border-collapse: collapse;
}

.wallet-view__history-column-header {
  padding: 8px 10px;
  border-top: 1px solid var(--color-tableborder);
  border-bottom: 1px solid var(--color-tableborder);
}

.wallet-view__history-cell {
  border-top: 1px solid var(--color-tableborder);
  padding: 5px;
  overflow: auto;
  white-space: nowrap;
}

.wallet-view__history-button {
  margin: 5px;
  padding: 5px 8px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: var(--color-button-bg);
  cursor: pointer;
}

.wallet-view__history-button:hover {
  background-color: var(--color-buttonselected-bg);
}

@media screen and (max-width: 600px) {
  .wallet-view__history {
    align-self: start;
  }
}

/* --- History Styles ENDS --- */

/* --- Edit Moviment Modal Styles --- */

.wallet-view__editmodal-overlay {
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

.wallet-view__editmodal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-self: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  position: fixed;
  min-height: 200px;
  height: 40dvh;
  max-height: 400px;
  min-width: 300px;
  width: 30dvw;
  max-width: 400px;
  background-color: var(--color-modal-bg);
  box-shadow: var(--modal-shadow);
  border-radius: 10px;
  z-index: 1010;
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
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.wallet-view__editmodal-button {
  margin: 5px;
  padding: 5px 5px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: var(--color-button-bg);
  cursor: pointer;
}

.wallet-view__editmodal-button:hover {
  background-color: var(--color-buttonselected-bg);
}

/* --- Edit Moviment Modal Styles ENDS --- */

/* --- Delete Moviment Modal Styles --- */

.wallet-view__deletemodal-overlay {
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

.wallet-view__deletemodal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-self: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  position: fixed;
  min-height: 150px;
  height: 30dvh;
  max-height: 200px;
  min-width: 300px;
  width: 20dvw;
  max-width: 400px;
  background-color: var(--color-modal-bg);
  box-shadow: var(--modal-shadow);
  border-radius: 10px;
  z-index: 1010;
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
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.wallet-view__deletemodal-button {
  margin: 5px;
  padding: 5px 8px;
  width: 32px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: var(--color-button-bg);
  cursor: pointer;
}

.wallet-view__deletemodal-button:hover {
  background-color: var(--color-buttonselected-bg);
}

/* --- Delete Moviment Modal Styles ENDS --- */
</style>
