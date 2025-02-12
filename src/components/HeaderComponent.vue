<template>
  <header class="header-container">
    <!-- Nav Section -->
    <div class="header-container__sidebar"></div>
    <div class="header-container__nav">
      <router-link to="/" class="header-container__link">Inicio</router-link>
      <router-link to="/OperationsView" class="header-container__link"
        >Operaciones</router-link
      >
      <router-link to="/WalletView" class="header-container__link"
        >Wallet</router-link
      >
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
    };
  },
  methods: {
    ...mapActions("user", ["logOut"]),
    openProfile() {
      this.selectedAvatar = !this.selectedAvatar;
    },
    logOutSession() {
      this.logOut();
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
  display: grid;
  margin: 10px 10px 50px 10px;
  padding: 0 5px;
  border-radius: 10px;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 3rem;
  align-items: center;
  background: linear-gradient(45deg, #1a1c35, #1f2d5a, #1f2061);
}
/* --- Header Main Styles Section ENDS --- */

/* --- Nav Styles Section --- */
.header-container__nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.header-container__link {
  text-decoration: none;
  padding: 13px 10px;
  color: white;
}

.header-container__link:hover {
  background: rgba(243, 243, 243, 0.664);
}
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

.header-container__avatar--img:hover {
  background-color: #0009;
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
  background-color: #ffff;
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

/* --- Profile Styles Section ENDS --- */
</style>
