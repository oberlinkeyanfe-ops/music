<template>
  <main class="container mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
    <section>
      <h2 class="text-2xl font-bold mb-4">Envoyer un titre</h2>
      <Upload :add-song="addSong" />
    </section>

    <section class="bg-white rounded border border-gray-200">
      <div class="px-4 pt-4 pb-3 font-bold border-b border-gray-200">Mes titres</div>
      <CompositionItem
        v-for="(song, i) in songs"
        :key="song.documentID"
        :song="song"
        :index="i"
        :update-song="updateSong"
        :remove-song="removeSong"
        :update-unsaved-flag="updateUnsavedFlag"
      />
      <p v-if="!songs.length" class="p-4 text-gray-500 text-sm">Vous n'avez encore rien envoyé.</p>
    </section>
  </main>
</template>

<script>
import Upload from "@/components/Upload.vue";
import CompositionItem from "@/components/CompositionItem.vue";
import { songsCollection, auth } from "@/includes/firebase";

export default {
  name: "Manage",
  components: { Upload, CompositionItem },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const snapshot = await songsCollection.where("uid", "==", auth.currentUser.uid).get();
    snapshot.forEach((document) => {
      this.songs.push({
        ...document.data(),
        documentID: document.id,
      });
    });
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-restricted-globals, no-alert
      const leave = confirm("Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?");
      next(leave);
    }
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modifiedName = values.modifiedName;
      this.songs[i].genre = values.genre;
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(songSnapshot) {
      this.songs.push({
        ...songSnapshot.data(),
        documentID: songSnapshot.id,
      });
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
};
</script>
