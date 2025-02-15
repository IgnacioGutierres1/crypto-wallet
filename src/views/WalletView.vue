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
              <a @click="openEditModal(historyData._id)">Editar</a
              ><a @click="deleteMoviment(historyData._id)">Borrar</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="modalEdit" class="edit-moviment__modal">
        <h3>Editar Movimiento</h3>
        <p>Ingresar monto:</p>
        <input type="number" v-model="newMount" />
        <button @click="editMoviment">Aceptar</button>
        <button>Cancelar</button>
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
      movimentId: "",
      newMount: "",
    };
  },
  methods: {
    ...mapActions("user", ["loadWallet", "editHistory"]),
    cargarDatos() {
      this.loadWallet();
    },
    openEditModal(movimentId) {
      this.modalEdit = !this.modalEdit;
      this.movimentId = movimentId;
    },
    editMoviment() {
      if (this.newMount > 0) {
        console.log("Id y Nuevo monto", this.movimentId, this.newMount);
        this.editHistory({
          movimentId: this.movimentId,
          newMount: this.newMount,
        });
      }
    },
    /* deleteMoviment(movimentId) {}, */
  },
  computed: {
    ...mapGetters("user", ["history", "wallet"]),
  },
};
</script>

<style scoped>
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
