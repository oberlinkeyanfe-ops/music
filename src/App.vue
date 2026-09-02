<template>
  <Header />
  <RouterView v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
  <Player />
  <Auth />
</template>

<script>
import Header from "@/components/Header.vue";
import Auth from "@/components/Auth.vue";
import Player from "@/components/Player.vue";

export default {
  name: "App",
  components: {
    Header,
    Auth,
    Player,
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
