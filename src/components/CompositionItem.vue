<template>
  <div class="border-b border-gray-200 p-3">
    <div v-show="!showForm" class="flex justify-between items-center">
      <h4 class="font-bold">{{ song.modifiedName }}</h4>
      <div class="flex gap-3">
        <button class="text-red-500" @click.prevent="deleteSong">
          <i class="fas fa-times"></i>
        </button>
        <button class="text-blue-500" @click.prevent="showForm = !showForm">
          <i class="fas fa-pencil-alt"></i>
        </button>
      </div>
    </div>

    <div v-show="showForm">
      <div v-if="showAlert" class="text-white text-center font-bold p-2 mb-2 text-sm" :class="alertVariant">
        {{ alertMessage }}
      </div>

      <VForm :validation-schema="schema" :initial-values="song" @submit="edit">
        <div class="mb-2">
          <label class="inline-block mb-1 text-sm">Titre</label>
          <Field
            name="modifiedName"
            class="block w-full py-1 px-2 border border-gray-300 rounded text-sm"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600 text-xs" name="modifiedName" />
        </div>
        <div class="mb-2">
          <label class="inline-block mb-1 text-sm">Genre</label>
          <Field
            name="genre"
            class="block w-full py-1 px-2 border border-gray-300 rounded text-sm"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600 text-xs" name="genre" />
        </div>
        <div class="flex gap-2">
          <button type="submit" :disabled="inSubmission" class="bg-purple-600 text-white text-sm py-1 px-3 rounded">
            Enregistrer
          </button>
          <button type="button" class="text-sm py-1 px-3" @click="showForm = false">Annuler</button>
        </div>
      </VForm>
    </div>
  </div>
</template>

<script>
import { Form as VForm, Field, ErrorMessage } from "vee-validate";
import { songsCollection } from "@/includes/firebase";
import { supabase, SONGS_BUCKET } from "@/includes/supabase";

export default {
  name: "CompositionItem",
  components: { VForm, Field, ErrorMessage },
  props: {
    song: { type: Object, required: true },
    index: { type: Number, required: true },
    updateSong: { type: Function, required: true },
    removeSong: { type: Function, required: true },
    updateUnsavedFlag: { type: Function, required: false, default: () => {} },
  },
  data() {
    return {
      showForm: false,
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Veuillez patienter...",
      schema: {
        modifiedName: "required",
        genre: "alpha_spaces",
      },
    };
  },
  methods: {
    async edit(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Mise à jour en cours...";

      try {
        await songsCollection.doc(this.song.documentID).update({
          modifiedName: values.modifiedName,
          genre: values.genre,
        });
      } catch {
        this.inSubmission = false;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Une erreur est survenue.";
        return;
      }

      this.updateUnsavedFlag(false);
      this.updateSong(this.index, values);

      this.inSubmission = false;
      this.alertVariant = "bg-green-500";
      this.alertMessage = "Titre mis à jour.";
    },
    async deleteSong() {
      await supabase.storage.from(SONGS_BUCKET).remove([this.song.originalName]);
      await songsCollection.doc(this.song.documentID).delete();

      this.removeSong(this.index);
    },
  },
};
</script>
