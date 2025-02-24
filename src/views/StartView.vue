<template>
  <!-- Start View Section -->

  <div class="start-view">
    <!-- LogIn Modal Section -->

    <div v-if="!login" class="start-view__login-modal">
      <div class="start-view__login-modal-header">
        <h1 class="start-view__login-modal-title">Crypto Wallet</h1>
      </div>
      <div class="start-view__login-modal-content">
        <h2 class="start-view__login-modal-subtitle">Inicio de Sesión</h2>
        <div class="start-view__login-modal-form-container">
          <form
            @submit.prevent="sendLogin"
            class="start-view__login-modal-form"
          >
            <input
              class="start-view__login-modal-input"
              type="text"
              placeholder="Ingrese su UserName"
              v-model="logUserName"
              required
            />
            <button class="start-view__login-modal-button" type="submit">
              Obtenga su ID
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- LogIn Modal Section ENDS -->

    <!-- User Info Modal Section -->

    <div v-if="userLoginModal" class="start-view__login-modal-userinfo">
      <a
        @click="closeUserModal"
        class="start-view__login-modal-userinfo-closebutton"
        >X</a
      >
      <p>{{ message }}</p>
      <p>Username: {{ userName }}</p>
      <p>ID: {{ getUserId }}</p>
    </div>

    <!-- User Info Modal Section ENDS -->

    <!-- User Section -->

    <h1 class="start-view__title">Crypto Wallet</h1>
    <div class="start-view__user-section">
      <img class="start-view__user-section-img" src="../assets/avatar.png" />
      <h2 class="start-view__user-section-username">{{ userName }}</h2>
      <div class="start-view__user-section-balancepart">
        <h3 class="start-view__user-section-balance">
          Saldo: $ {{ parseFloat(balance.toFixed(2)).toLocaleString("es-AR") }}
        </h3>
        <button
          @click="openCloseBalanceModal"
          class="start-view__user-section-button"
        >
          Modificar
        </button>
      </div>
    </div>

    <!-- Balance Modal Section -->

    <div v-if="balanceModal" class="start-view__balance-modal-container">
      <div class="start-view__balance-modal">
        <h3>Modificar Saldo</h3>
        <a
          @click="openCloseBalanceModal"
          class="start-view__balance-modal-close-button"
          >X</a
        >
        <p>{{ message }}</p>
        <input
          class="balance-modal__input"
          type="number"
          placeholder="Saldo"
          v-model="newBalanceAmount"
          Step="0.01"
        />
        <div class="start-view__balance-modal-buttons">
          <button
            class="start-view__balance-modal-button"
            @click="depositMoney"
          >
            Ingresar
          </button>
          <button
            class="start-view__balance-modal-button"
            @click="withdrawMoney"
          >
            Extraer
          </button>
        </div>
      </div>
    </div>

    <!-- Balance Modal Section ENDS -->

    <!-- User Section Section ENDS -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "StartView",
  data() {
    return {
      logUserName: "",
      userLoginModal: false,
      balanceModal: false,
      message: "",
      newBalanceAmount: 0,
    };
  },
  methods: {
    ...mapActions("user", ["saveUser", "editBalance"]),
    async sendLogin() {
      if (this.logUserName.trim()) {
        this.message = await this.saveUser(this.logUserName);
        this.userLoginModal = !this.userLoginModal;
      }
    },
    closeUserModal() {
      this.userLoginModal = !this.userLoginModal;
      this.message = "";
    },

    openCloseBalanceModal() {
      this.balanceModal = !this.balanceModal;
      if (this.balanceModal === false) {
        this.message = "";
      }
    },

    async depositMoney() {
      if (this.newBalanceAmount > 0) {
        this.message = await this.editBalance({
          action: "deposit",
          amount: this.newBalanceAmount,
        });
      }
    },
    async withdrawMoney() {
      if (this.newBalanceAmount > 0 && this.balance >= this.newBalanceAmount) {
        this.message = await this.editBalance({
          action: "withdraw",
          amount: this.newBalanceAmount,
        });
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
/* --- Start View Styles --- */

.start-view {
  display: flex;
  width: 80vw;
  min-height: 50vh;
  margin: 0 auto;
  flex-direction: column;
}

/* --- Start View Styles ENDS --- */

/* --- Login Modal Styles --- */

.start-view__login-modal {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  width: 30%;
  height: 70%;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.start-view__login-modal-header {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  text-align: center;
}

.start-view__login-modal-title {
  align-self: center;
  width: 85%;
  padding: 20px 0 20px 0;
  border-bottom: 5px solid;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    #0009 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

.start-view__login-modal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -90px;
}

.start-view__login-modal-subtitle {
  margin-bottom: 30px;
  justify-self: start;
}

.start-view__login-modal-form-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 10px;
  width: 100%;
}

.start-view__login-modal-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.start-view__login-modal-input {
  width: 90%;
  padding: 5px;
}

.start-view__login-modal-button {
  width: 65%;
  padding: 4px 10px;
  border-radius: 5px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
}

/* --- User Info Modal Styles --- */

.start-view__login-modal-userinfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-self: center;
  align-self: center;
  align-items: center;
  gap: 10px;
  position: fixed;
  width: 20%;
  height: 20%;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.start-view__login-modal-userinfo-closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

/* --- User Info Modal Styles ENDS ---*/

/* --- Login Modal Styles Section ENDS --- */

/* --- User Section Styles --- */

.start-view__title {
  align-self: center;
  padding-bottom: 20px;
  margin-bottom: 40px;
  width: 100%;
  border-bottom: 5px solid;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    #0009 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

.start-view__user-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.start-view__user-section-img {
  width: 75px;
  margin-right: 10px;
}

.start-view__user-section-username {
  margin-left: 10px;
}

.start-view__user-section-balancepart {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 5px;
  margin-left: auto;
}

.start-view__user-section-balance {
  width: auto;
}

.start-view__user-section-button {
  padding: 5px 2px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
  cursor: pointer;
}

/*--- Balance Modal Styles ---*/

.start-view__balance-modal-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  position: fixed;
  width: 300px;
  height: auto;
  margin-top: 80px;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.start-view__balance-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 15px 10px;
}

.start-view__balance-modal-close-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

.start-view__balance-modal-buttons {
  display: flex;
  gap: 8px;
}

.start-view__balance-modal-button {
  padding: 6px 4px;
  border-radius: 5px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
}
</style>
