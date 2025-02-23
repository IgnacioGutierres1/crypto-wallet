<template>
  <!-- Main Container -->
  <div class="start-view">
    <!-- LogIn Modal Container -->
    <div v-if="!login" class="main-container__login-modal">
      <div class="login-modal__header">
        <h1 class="login-modal__title">Crypto Wallet</h1>
      </div>
      <div class="login-modal__content">
        <h2 class="login-modal__subtitle">Inicio de Sesión</h2>
        <div class="login-modal__form-container">
          <form @submit.prevent="sendLogin" class="login-modal__form">
            <input
              class="login-modal__input"
              type="text"
              placeholder="Ingrese su UserName"
              v-model="logUserName"
              required
            />
            <button class="login-modal__button" type="submit">
              Obtenga su ID
            </button>
          </form>
        </div>
      </div>
    </div>
    <!-- User Info Modal Container -->
    <div v-if="userLoginModal" class="login-modal__userinfo">
      <a @click="closeUserModal" class="login-modal__userinfo--closebutton"
        >X</a
      >
      <p>{{ message }}</p>
      <p>Username: {{ userName }}</p>
      <p>ID: {{ getUserId }}</p>
    </div>
    <!-- User Info Modal Container -->
    <!-- Log In Modal Container ENDS -->
    <!-- User Section Container -->
    <h1 class="start-view__title">Crypto Wallet</h1>
    <div class="start-view__user-section">
      <img class="user-section__img" src="../assets/avatar.png" />
      <h2 class="user-section__username">{{ userName }}</h2>
      <div class="user-section__balancepart">
        <h3 class="user-section__balance">Saldo: $ {{ balance }}</h3>
        <button @click="openCloseBalanceModal" class="user-section__button">
          Modificar
        </button>
      </div>
    </div>
    <!-- Balance Modal Container -->
    <div v-if="balanceModal" class="start-view__balance-modal">
      <div class="balance-modal__container">
        <h3>Modificar Saldo</h3>
        <a
          @click="openCloseBalanceModal"
          class="balance-modal__openclose-button"
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
        <div class="balance-modal__buttons-container">
          <button class="balance-modal__button" @click="depositMoney">
            Ingresar
          </button>
          <button class="balance-modal__button" @click="withdrawMoney">
            Extraer
          </button>
        </div>
      </div>
    </div>
    <!-- Balance Modal Container ENDS -->
    <!-- User Section Container ENDS -->
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
/* --- Start Main Styles Section --- */
.start-view {
  display: flex;
  width: 80vw;
  min-height: 50vh;
  margin: 0 auto;
  flex-direction: column;
}
/* --- Start Main Styles Section ENDS --- */

/* --- Login Modal Styles Section --- */
.main-container__login-modal {
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

.login-modal__header {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  text-align: center;
}

.login-modal__title {
  align-self: center;
  width: 85%;
  padding: 20px 0 20px 0;
  /* border-bottom: 2px solid #0004; */
  border-bottom: 5px solid;
  border-image-source: linear-gradient(
    to right,
    transparent 0%,
    #0009 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

.login-modal__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -90px;
}

.login-modal__subtitle {
  margin-bottom: 30px;
  justify-self: start;
}

.login-modal__form-container {
  display: flex;
  flex-direction: column;
  justify-self: center;
  gap: 10px;
  width: 100%;
}

.login-modal__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.login-modal__input {
  width: 90%;
  padding: 5px;
}

.login-modal__button {
  width: 65%;
  padding: 4px 10px;
  border-radius: 5px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
}

/* --- User Info Modal Styles --- */

.login-modal__userinfo {
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

.login-modal__userinfo--closebutton {
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

.user-section__img {
  width: 75px;
  margin-right: 10px;
}

.user-section__username {
  margin-left: 10px;
}

.user-section__balancepart {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  gap: 5px;
  margin-left: auto;
}

.user-section__balance {
  width: auto;
}

.user-section__button {
  padding: 5px 2px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
}

/*--- Balance Modal Styles ---*/
.start-view__balance-modal {
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

.balance-modal__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 15px 10px;
}

.balance-modal__buttons-container {
  display: flex;
  gap: 8px;
}

.balance-modal__button {
  padding: 6px 4px;
  border-radius: 5px;
  border-style: none;
  color: #fffe;
  background-color: #1f2d5a;
}

.balance-modal__openclose-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}
</style>
