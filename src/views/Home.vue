<template>
  <main>
    <section class="mb-8 py-16 text-white text-center bg-gray-800">
      <h1 class="font-bold text-4xl mb-3">Écoutez de la super musique !</h1>
      <p class="w-full md:w-8/12 mx-auto text-gray-300">
        Découvrez et écoutez les titres partagés par la communauté.
      </p>
    </section>

    <section class="container mx-auto px-4">
      <div class="bg-white rounded border border-gray-200">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span>Titres</span>
          <i class="fa fa-headphones-alt float-right text-green-400 text-xl"></i>
        </div>
        <ol id="playlist">
          <SongItem v-for="song in songs" :key="song.docID" :song="song" />
        </ol>
        <p v-if="!songs.length" class="p-6 text-gray-500 text-sm">Aucun titre pour le moment.</p>
      </div>
    </section>
  </main>
</template>

<script>
import SongItem from "@/components/SongItem.vue";
import { songsCollection } from "@/includes/firebase";

export default {
  name: "Home",
  components: { SongItem },
  data() {
    return {
      songs: [],
      maxPerPage: 10,
      pendingRequest: false,
    };
  },
  created() {
    this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    async getSongs() {
      if (this.pendingRequest) return;
      this.pendingRequest = true;

      let snapshot;

      if (this.songs.length) {
        const lastDocument = await songsCollection.doc(this.songs[this.songs.length - 1].docID).get();
        snapshot = await songsCollection.orderBy("modifiedName").startAfter(lastDocument).limit(this.maxPerPage).get();
      } else {
        snapshot = await songsCollection.orderBy("modifiedName").limit(this.maxPerPage).get();
      }

      snapshot.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      const bottomOfWindow = Math.round(scrollTop + innerHeight) === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
  },
};
</script>
