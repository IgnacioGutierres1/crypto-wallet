<template>
  <div v-if="!login" class="login-container">
    <h1>Crypto Wallet</h1>
    <span>Inicio de Sesión</span>
    <form @submit.prevent="sendLogin">
      <div>
        <input
          type="text"
          placeholder="Ingrese su UserName"
          v-model="logUserName"
          required
        />
      </div>
      <div>
        <button type="submit">Obtenga su ID</button>
      </div>
    </form>
    <div>
      <p>Username: {{ userName }}</p>
      <p>ID: {{ getUserId }}</p>
    </div>
  </div>
  <div>
    <h2>userName: {{ userName }}</h2>
    <h3>Saldo: {{ balance }}</h3>
    <input type="number" v-model="newBalanceAmount" Step="0.01" />
    <button @click="depositMoney">Ingresar</button>
    <button @click="withdrawMoney">Extraer</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InicioView",
  data() {
    return {
      logUserName: "",
      newBalanceAmount: 0,
    };
  },
  methods: {
    ...mapActions("user", ["saveUser", "editBalance"]),
    sendLogin() {
      if (this.logUserName.trim()) {
        this.saveUser(this.logUserName);
      }
    },
    depositMoney() {
      if (this.newBalanceAmount > 0) {
        this.editBalance({ action: "deposit", amount: this.newBalanceAmount });
      }
    },
    withdrawMoney() {
      if (this.newBalanceAmount > 0 && this.balance >= this.newBalanceAmount) {
        this.editBalance({ action: "withdraw", amount: this.newBalanceAmount });
      }
    },
  },

  computed: {
    ...mapGetters("user", ["userName", "userId", "balance", "login"]),
    getUserId() {
      return this.userId;
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 60vh;
}
</style>
