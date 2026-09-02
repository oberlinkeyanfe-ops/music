import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./includes/validation";
import { auth } from "./includes/firebase";
import { useUserStore } from "./stores/user";

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    const pinia = createPinia();
    app.use(pinia);
    app.use(router);

    // Restaure l'état "connecté" si l'utilisateur a déjà une session Firebase active
    const userStore = useUserStore();
    if (auth.currentUser) {
      userStore.userLoggedIn = true;
    }

    app.mount("#app");
  }
});
