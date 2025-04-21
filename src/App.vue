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

:root {
  --color-main-bg: #0f172a;
  --color-modal-bg: #2b323d;
  /* --color-modal-bg: #f5f5f5; */
  --color-line-decoration: #4164d4;
  --color-font: #f3f4f6;
  --color-button-bg: #1f2d5a;
  --color-buttonselected-bg: #345ad6dc;
  --modal-shadow: 0 0 15px #0d36be59;
}

html,
body,
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  color: var(--color-font);
  background-color: var(--color-main-bg);
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
