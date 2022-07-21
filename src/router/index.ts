import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/order-tracking",
      name: "order-tracking",
      component: () => import("../views/TrackOrderView.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/SetAddressPage.vue"),
    }
  ],
});

export default router;
