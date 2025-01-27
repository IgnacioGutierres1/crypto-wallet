<template>
  <div class="home">
    <h1>Crypto Wallet</h1>
    <span>Inicio de Sesión</span>
    <form @submit.prevent="sendLogin">
      <div>
        <input
          type="text"
          placeholder="Ingrese su UserName"
          v-model="userName"
          required
        />
      </div>
      <div>
        <button type="submit">Obtenga su ID</button>
      </div>
    </form>

    <div>
      <p>Username: {{ userName }}</p>
      <p>ID: {{ userId }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "InicioView",
  data() {
    return {
      userName: "",
    };
  },
  methods: {
    ...mapActions("user", ["saveUser"]),
    sendLogin() {
      if (this.userName.trim()) {
        this.saveUser(this.userName);
      }
    },
  },

  computed: {
    ...mapGetters("user", ["getUserName", "getUserId"]),
    userId() {
      return this.getUserId;
    },
  },
};
</script>
