<template>
  <h1>Wallet</h1>
  <div class="main-container">
    <h2>Saldo Actual:</h2>
    <strong>$ {{ balance }}</strong>
    <button @click="cargarDatos">Cargar Datos</button>
    <div>
      <h3>Portfolio</h3>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Balance Actual en ARS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(cryptoAmount, crypto) in portfolio" :key="crypto">
            <td>{{ crypto }}</td>
            <td>{{ cryptoAmount }}</td>
            <td>$ {{ updatePortfolioBalance(cryptoAmount, crypto) }}</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td></td>
            <td>$ {{ totalPortfolioBalance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="history-container">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Operacion</th>
            <th>Cantidad</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Editar o Borrar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(historyData, history) in history" :key="history">
            <td>{{ historyData.crypto_code }}</td>
            <td>{{ historyData.action }}</td>
            <td>{{ historyData.crypto_amount }}</td>
            <td>$ {{ historyData.money.toLocaleString("es-AR") }}</td>
            <td>{{ historyData.datetime }}</td>
            <td>
              <a
                @click="
                  openEditModal(
                    historyData._id,
                    historyData.action,
                    historyData.crypto_amount,
                    historyData.money
                  )
                "
                >Editar</a
              ><a @click="openDeleteModal(historyData._id)">Borrar</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="modalEdit" class="edit-moviment__modal">
        <h3>Editar Movimiento</h3>
        <p>Ingresar monto:</p>
        <p>{{ eMessage }}</p>
        <input type="number" v-model="newAmount" />
        <button @click="editMoviment">Aceptar</button>
        <button>Cancelar</button>
      </div>
      <div v-if="modalDelete" class="delete-moviment__modal">
        <h3>Borrar Movimiento</h3>
        <p>Desea Eliminar el movimiento?</p>
        <button @click="deleteMoviment">Si</button>
        <button>No</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "WalletView",
  data() {
    return {
      modalEdit: false,
      eMessage: "",
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
    /* ...mapActions("cryptostore", ["updatePortfolioBalance"]), */
    cargarDatos() {
      this.loadPortfolio();
    },
    /*  async portfolioCoinBalance(crypto_amount, coin) {
      const coinBalance = await this.updatePortfolioBalance({
        crypto_amount: crypto_amount,
        coin: coin,
      });
      console.log("resultado de la accion de coin balance: ", coinBalance);
      return coinBalance;
    }, */
    openEditModal(
      movimentId,
      action,
      pOriginalCryptoAmount,
      pOriginalMoneyAmount
    ) {
      this.modalEdit = !this.modalEdit;
      this.movimentId = movimentId;
      this.action = action;
      this.originalCryptoAmount = pOriginalCryptoAmount;
      this.originalMoneyAmount = pOriginalMoneyAmount;
      console.log("monto", this.originalMoneyAmount);
    },
    editMoviment() {
      if (this.newAmount > 0) {
        if (
          this.action === "Compra" &&
          this.newAmount < this.originalMoneyAmount
        ) {
          this.editHistory({
            movimentId: this.movimentId,
            originalCryptoAmount: this.originalCryptoAmount,
            originalMoneyAmount: this.originalMoneyAmount,
            newAmount: this.newAmount,
            action: this.action,
          });
        } else {
          this.eMessage = "El monto para editar una compra debe ser menor";
        }
      }
    },
    openDeleteModal(movimentId) {
      this.modalDelete = !this.modalDelete;
      this.movimentId = movimentId;
    },
    deleteMoviment() {
      console.log("Id a eliminar:", this.movimentId);
      this.deleteHistory(this.movimentId);
    },
  },
  computed: {
    ...mapGetters("user", ["history", "balance", "portfolio"]),
    ...mapGetters("cryptostore", [
      "updatePortfolioBalance",
      "totalPortfolioBalance",
    ]),
  },
};
</script>

<style scoped>
body {
  overflow-y: auto;
}

a {
  cursor: pointer;
}

.edit-moviment__modal {
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
</style>
