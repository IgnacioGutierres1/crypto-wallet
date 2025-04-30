<template>
  <header class="header-container">
    <!-- Nav Section -->

    <div class="header-container__sidebar"></div>
    <div class="header-container__nav">
      <a @click="openCloseSidebar">Sidebar</a>
      <router-link to="/" class="header-container__link">
        <span class="material-symbols-outlined header-container__link-symbol"
          >home</span
        >
        Inicio
      </router-link>
      <router-link to="/OperationsView" class="header-container__link">
        <span class="material-symbols-outlined">monitoring</span>
        Operaciones
      </router-link>
      <router-link to="/WalletView" class="header-container__link">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        Wallet
      </router-link>
    </div>

    <!-- Nav Section -->
    <!-- Profile Section -->
    <div class="header-container__avatar">
      <img
        src="../assets/avatar.png"
        class="header-container__avatar--img"
        :class="{ 'avatar-selected': selectedAvatar }"
        @click="openProfile"
      />
    </div>

    <div v-if="selectedAvatar" class="header-container__profile">
      <h3>Perfil</h3>
      <div v-if="login">
        <p>UserName: {{ userName }}</p>
        <p>ID: {{ userId }}</p>
        <button
          @click="logOutSession"
          class="header-container__profile--logout"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
    <!-- Profile Section -->
  </header>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HeaderComponent",
  data() {
    return {
      selectedAvatar: false,
      sidebarOpen: false,
    };
  },
  methods: {
    ...mapActions("user", ["logOut"]),
    openCloseSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    openProfile() {
      this.selectedAvatar = !this.selectedAvatar;
    },
    logOutSession() {
      this.logOut();
      this.selectedAvatar = !this.selectedAvatar;
    },
  },
  computed: {
    ...mapGetters("user", ["userName", "userId", "login"]),
  },
};
</script>
<style scoped>
/* --- Header Main Styles Section Section --- */
.header-container {
  /* display: grid; */
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 6px;
  border-radius: 10px;
  height: 100dvh;
  width: 170px;
  /* grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 3rem; 
  align-items: center; */
  background: linear-gradient(45deg, #1a1c35, #1f2d5a, #1f2061);
}
/* --- Header Main Styles Section ENDS --- */

/* --- Nav Styles Section --- */
.header-container__nav {
  display: flex;
  flex-direction: column;
  align-items: start;
  /* justify-content: center; */
  gap: 8px;
}

.header-container__nav-item {
  width: 100%;
}

/* .header-container__nav-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px 4px;
  border-radius: 8px;
} */

.header-container__link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 8px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  gap: 8px;
}

.header-container__link:hover {
  background: var(--color-linkselected-bg);
}

.header-container__link-symbol {
  margin-bottom: 3px;
}

/* .header-container__link {
  text-decoration: none;
  padding: 13px 10px;
  color: white;
} */

/* --- Nav Styles Section ENDS --- */

/* --- Profile Styles Section --- */
.header-container__avatar {
  justify-self: end;
}

.header-container__avatar--img {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  text-decoration: none;
  cursor: pointer;
  width: 30px;
  justify-self: end;
}

.header-container__avatar--img.avatar-selected {
  background-color: #0002;
}

.header-container__profile {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: absolute;
  bottom: 200px;
  right: 40px;
  width: 350px;
  height: 350px;
  padding: 12px;
  border-radius: 10px 0 10px 10px;
  background-color: var(--color-modal-bg);
  box-shadow: 0 0 10px #0000001a;
}

.header-container__profile--logout {
  height: 30px;
  padding: 5px 8px;
  margin: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
}

/* --- Profile Styles Section Ends --- */
</style>
