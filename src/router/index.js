import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import OperationsView from "../views/OperationsView.vue";
import WalletView from "../views/WalletView.vue";

const routes = [
  {
    path: "/",
    name: "StartView",
    component: StartView,
  },
  {
    path: "/OperationsView",
    name: "OperationsView",
    component: OperationsView,
  },
  {
    path: "/WalletView",
    name: "WalletView",
    component: WalletView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
