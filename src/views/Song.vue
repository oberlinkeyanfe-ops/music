<template>
  <main class="container mx-auto px-4 py-8" v-if="song.modifiedName">
    <section class="bg-white rounded border border-gray-200 p-6 mb-6">
      <h1 class="text-2xl font-bold">{{ song.modifiedName }}</h1>
      <p class="text-gray-500">{{ song.genre || "Genre non renseigné" }}</p>
      <button id="play-button" class="mt-4 bg-purple-600 text-white py-2 px-4 rounded" @click.prevent="play">
        <i class="fa fa-play"></i> Écouter
      </button>
    </section>

    <section id="comments" class="bg-white rounded border border-gray-200 p-6">
      <h2 class="text-xl font-bold mb-4">
        {{ song.commentCount }} commentaire{{ song.commentCount > 1 ? "s" : "" }}
      </h2>

      <VForm v-if="userLoggedIn" :validation-schema="schema" @submit="addComment">
        <div v-if="showAlert" class="text-white text-center font-bold p-2 mb-3 text-sm" :class="alertVariant">
          {{ alertMessage }}
        </div>
        <Field as="textarea" name="comment" rows="3" class="block w-full py-2 px-3 border border-gray-300 rounded mb-1" />
        <ErrorMessage class="text-red-600 text-sm block mb-2" name="comment" />
        <button type="submit" :disabled="inSubmission" class="bg-purple-600 text-white py-1.5 px-4 rounded">
          Publier
        </button>
      </VForm>
      <p v-else class="text-gray-500 text-sm mb-4">Connectez-vous pour laisser un commentaire.</p>

      <div class="my-4">
        <label class="text-sm mr-2">Trier :</label>
        <select v-model="sort" class="border border-gray-300 rounded py-1 px-2 text-sm">
          <option :value="1">Plus récents</option>
          <option :value="2">Plus anciens</option>
        </select>
      </div>

      <ul>
        <li v-for="comment in sortedComments" :key="comment.id" class="border-t border-gray-200 py-3">
          <p class="font-bold text-sm">{{ comment.name }}</p>
          <p class="text-sm text-gray-600">{{ comment.content }}</p>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { Form as VForm, Field, ErrorMessage } from "vee-validate";
import { songsCollection, commentsCollection, auth } from "@/includes/firebase";
import { useUserStore } from "@/stores/user";
import { usePlayerStore } from "@/stores/player";

export default {
  name: "Song",
  components: { VForm, Field, ErrorMessage },
  data() {
    return {
      song: {},
      comments: [],
      sort: 1,
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Veuillez patienter...",
      schema: {
        comment: "required|min:3",
      },
    };
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),
    sortedComments() {
      return [...this.comments].sort((a, b) => {
        if (this.sort === 1) {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  watch: {
    sort(newValue) {
      if (newValue === Number(this.$route.query.sort)) return;
      this.$router.push({ query: { sort: newValue } });
    },
  },
  async created() {
    const sortQuery = Number(this.$route.query.sort);
    if (sortQuery === 1 || sortQuery === 2) {
      this.sort = sortQuery;
    }

    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapshot.exists) {
      this.$router.push({ name: "home" });
      return;
    }

    this.song = docSnapshot.data();
    await this.getComments();
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    play() {
      this.newSong({ ...this.song, docID: this.$route.params.id });
    },
    async getComments() {
      const snapshot = await commentsCollection.where("sid", "==", this.$route.params.id).get();
      this.comments = [];
      snapshot.forEach((document) => {
        this.comments.push({ id: document.id, ...document.data() });
      });
    },
    async addComment(values, context) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Publication en cours...";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);

      this.song.commentCount += 1;
      await songsCollection.doc(this.$route.params.id).update({
        commentCount: this.song.commentCount,
      });

      await this.getComments();

      this.inSubmission = false;
      this.alertVariant = "bg-green-500";
      this.alertMessage = "Commentaire publié.";

      context.resetForm();
    },
  },
};
</script>
