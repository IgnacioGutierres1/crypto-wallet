<template>
  <header
    class="header-container"
    :class="{ 'sidebar-contracted': !sidebarExpanded }"
  >
    <!-- Nav Section -->

    <div class="header-container__sidebarbuttons">
      <span
        v-if="!sidebarExpanded"
        class="material-symbols-outlined header-container__button header-container__openbutton"
        @click="changeSidebar"
        >menu</span
      >
      <span
        v-if="sidebarExpanded"
        class="material-symbols-outlined header-container__button header-container__closebutton"
        @click="changeSidebar"
        >menu_open</span
      >
    </div>
    <div class="header-container__nav">
      <router-link to="/" class="header-container__link">
        <span class="material-symbols-outlined header-container__link-symbol"
          >home</span
        >
        <p v-if="sidebarExpanded">Inicio</p>
      </router-link>
      <router-link to="/OperationsView" class="header-container__link">
        <span class="material-symbols-outlined">monitoring</span>
        <p v-if="sidebarExpanded">Operaciones</p>
      </router-link>
      <router-link to="/WalletView" class="header-container__link">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <p v-if="sidebarExpanded">Wallet</p>
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
          <span class="material-symbols-outlined"> logout </span>
        </button>
      </div>
    </div>
    <!-- Profile Section -->
  </header>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

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
    ...mapMutations("ui", ["changeSidebar"]),
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
    ...mapGetters("ui", ["sidebarExpanded"]),
  },
};
</script>
<style scoped>
/* --- Header Main Styles Section Section --- */
.header-container {
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px 6px;
  border-radius: 10px;
  height: 100dvh;
  width: 170px;
  /* grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 3rem; 
  align-items: center; */
  background: linear-gradient(45deg, #1a1c35, #1f2d5a, #1f2061);
}

.sidebar-contracted {
  width: 50px;
}

/* --- Header Main Styles Section Ends --- */

/* --- Sidebar Buttons --- */

.header-container__sidebarbuttons {
  display: flex;
  justify-content: end;
}

.header-container__button {
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
}

.header-container__button:hover {
  background-color: #000000ea;
}

.header-container__closebutton {
  margin-left: auto;
}

/* --- Sidebar Buttons Ends --- */

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
  bottom: 32px;
  left: 52px;
  width: 350px;
  height: 350px;
  padding: 12px;
  border-radius: 10px 10px 10px 0;
  background-color: var(--color-modal-bg);
  box-shadow: 0 0 10px #0000001a;
}

.header-container__profile--logout {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 15px 8px;
  margin: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--color-button-bg);
  border-style: none;
  border-radius: 4px;
  color: var(--color-font);
  cursor: pointer;
}

.header-container__profile--logout:hover {
  background-color: var(--color-buttonselected-bg);
}

/* --- Profile Styles Section Ends --- */
</style>
