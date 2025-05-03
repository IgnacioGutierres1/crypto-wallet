import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

/* if (process.env.NODE_ENV === "development") {
  import("@vue/devtools").then(({ setupDevtools }) => {
    setupDevtools();
  });
} */

createApp(App).use(store).use(router).mount("#app");
