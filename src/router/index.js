import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../views/Inicio.vue";
import OperationsView from "../views/OperationsView.vue";

const routes = [
  {
    path: "/",
    name: "Inicio",
    component: Inicio,
  },
  {
    path: "/OperationsView",
    name: "OperationsView",
    component: OperationsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
