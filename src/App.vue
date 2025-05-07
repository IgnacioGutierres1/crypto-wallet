<template>
  <HeaderComponent></HeaderComponent>
  <main class="main-content" :class="{ 'sidebar-expanded': !sidebarExpanded }">
    <router-view />
  </main>
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
    ...mapGetters("ui", ["sidebarExpanded"]),
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
  --color-sections-bg: #38383833;
  --color-line-decoration: #4164d4;
  --color-font: #f3f4f6;
  --color-button-bg: #1f2d5a;
  --color-buttonselected-bg: #345ad6dc;
  --color-linkselected-bg: #0a0a0a;
  --modal-shadow: 0 0 15px #0d36be59;
  --color-tableborder: #808080a1;
}

html,
body,
#app {
  font-family: Helvetica, Arial, sans-serif;
  text-align: center;
  color: var(--color-font);
  background-color: var(--color-main-bg);
}

#app {
  display: flex;
  height: 100dvh;
}

.main-content {
  min-width: calc(100dvw - 170px);
  height: 100dvh;
  margin-left: 170px;
  padding: 30px 20px;
  flex: 1;
  flex-shrink: 0;
  overflow-x: hidden;
}

.sidebar-expanded {
  min-width: calc(100dvw - 50px);
  margin-left: 50px;
}
</style>
