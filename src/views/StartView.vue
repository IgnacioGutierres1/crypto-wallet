<template>
  <!-- Start View Section -->

  <div class="start-view">
    <!-- Modal Overlay Blur Section -->

    <div
      v-if="!login || userLoginModal || balanceModal"
      class="modal-overlay"
    ></div>

    <!-- Modal Overlay Blur Section ENDS -->

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
          class="start-view__user-section-balance-button"
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
          class="start-view__balance-modal-input"
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
  padding: 10px;
  flex-direction: column;
  flex: 1;
}

/* @media (max-width: 600px) {
  .start-view {
    width: 90dvw;
  }
} */

/* --- Start View Styles Ends --- */

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

/* --- Modal Overlay Blur Styles ENDS --- */

/* --- Login Modal Styles --- */

.start-view__login-modal {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-self: center;
  align-items: center;
  gap: 10px;
  background-color: var(--color-modal-bg);
  box-shadow: var(--modal-shadow);
  border-radius: 10px;
  position: fixed;
  /* width: 35%;
  height: 70%; */
  min-width: 400px;
  width: 35vw;
  max-width: 470px;
  height: 80vh;
  min-height: 400px;
  max-height: 480px;
  overflow-y: auto; /* scroll  */
  z-index: 1010;
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
    var(--color-line-decoration) 50%,
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
  margin-top: -100px;
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
  gap: 20px;
}

.start-view__login-modal-input {
  width: 90%;
  color: var(--color-font);
  background-color: #fff1;
  padding: 7px 17px;
  border: 1px solid transparent;
  outline: none;
  border-radius: 5px;
}

.start-view__login-modal-input:focus {
  border: 1px solid #006eff;
  outline: none;
}

.start-view__login-modal-button {
  width: 65%;
  padding: 8px 10px;
  border-radius: 5px;
  border-style: none;
  color: #fffe;
  background-color: var(--color-button-bg);
  cursor: pointer;
}

.start-view__login-modal-button:hover {
  background-color: var(--color-buttonselected-bg);
}

/* --- Login Modal Media Queries --- */

@media (max-width: 600px) {
  .start-view__login-modal {
    top: 10vh;
    min-width: 300px;
    width: 80vw;
    margin: auto;
    max-width: 350px;
    height: 50vh;
  }
}

/* --- Login Modal Styles Ends --- */

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
  background-color: var(--color-modal-bg);
  box-shadow: var(--modal-shadow);
  border-radius: 10px;
  z-index: 1010;
}

.start-view__login-modal-userinfo-closebutton {
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  cursor: pointer;
}

/* --- User Info Modal Styles Ends ---*/

/* --- Login Modal Styles Section Ends --- */

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
    var(--color-line-decoration) 50%,
    transparent 100%
  );
  border-image-slice: 1;
}

.start-view__user-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 18px 22px;
  border-radius: 20px;
  background-color: var(--color-sections-bg);
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
  justify-content: center;
  gap: 5px;
  margin-left: auto;
}

.start-view__user-section-balance {
  width: auto;
}

.start-view__user-section-balance-button {
  align-self: center;
  width: 84px;
  height: 25px;
  padding: 5px 2px;
  border-radius: 4px;
  border-style: none;
  color: #fffe;
  background-color: var(--color-button-bg);
  cursor: pointer;
}

.start-view__user-section-balance-button:hover {
  background-color: var(--color-buttonselected-bg);
}

@media (max-width: 600px) {
  .start-view__user-section {
  }
}

/* --- User Section Styles Ends --- */

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
  background-color: var(--color-modal-bg);
  border-radius: 10px;
  z-index: 1010;
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

.start-view__balance-modal-input {
  width: 80%;
  color: var(--color-font);
  background-color: #fff1;
  padding: 6px 12px;
  border: 1px solid transparent;
  outline: none;
  border-radius: 5px;
}

.start-view__balance-modal-buttons {
  display: flex;
  gap: 10px;
}

.start-view__balance-modal-button {
  padding: 6px 13px;
  border-radius: 5px;
  border-style: none;
  color: #fffe;
  background-color: var(--color-button-bg);
  cursor: pointer;
}

.start-view__balance-modal-button:hover {
  background-color: var(--color-buttonselected-bg);
}
</style>
