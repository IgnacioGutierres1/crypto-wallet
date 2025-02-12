<template>
  <HeaderComponent></HeaderComponent>
  <router-view />
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    HeaderComponent,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("user", ["login"]),
  },
};
</script>

<style>
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
