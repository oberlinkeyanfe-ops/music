<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-between items-center py-5 px-4">
      <RouterLink class="text-white font-bold uppercase text-2xl mr-4" :to="{ name: 'home' }" exact-active-class="no-active">
        Music
      </RouterLink>

      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1 gap-4">
          <li>
            <RouterLink class="px-2 text-white" :to="{ name: 'about' }">À propos</RouterLink>
          </li>
          <li v-if="userLoggedIn">
            <RouterLink class="px-2 text-white" :to="{ name: 'manage' }">Gérer mes titres</RouterLink>
          </li>
          <li v-if="!userLoggedIn">
            <a class="px-2 text-white cursor-pointer" href="#" @click.prevent="modalStore.open()">
              Connexion / Inscription
            </a>
          </li>
          <li v-if="userLoggedIn">
            <a class="px-2 text-white cursor-pointer" href="#" @click.prevent="signOut">Déconnexion</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores, mapState, mapActions } from "pinia";
import { useModalStore } from "@/stores/modal";
import { useUserStore } from "@/stores/user";

export default {
  name: "Header",
  computed: {
    ...mapStores(useModalStore),
    ...mapState(useUserStore, ["userLoggedIn"]),
  },
  methods: {
    ...mapActions(useUserStore, ["signOut"]),
  },
};
</script>
