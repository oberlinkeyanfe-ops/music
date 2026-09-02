import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About.vue"),
  },
  {
    path: "/manage",
    name: "manage",
    component: () => import("../views/Manage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/song/:id",
    name: "song",
    component: () => import("../views/Song.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) return true;

  const store = useUserStore();
  if (store.userLoggedIn) return true;

  return { name: "home" };
});

export default router;
