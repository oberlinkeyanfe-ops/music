<template>
  <div class="bg-white rounded border border-gray-200 p-4">
    <div
      id="drop-zone"
      class="p-6 rounded border-4 border-dashed text-center cursor-pointer transition"
      :class="isDragover ? 'bg-green-100 border-green-400' : 'border-gray-300'"
      @drag.prevent.stop
      @dragstart.prevent.stop
      @dragend.prevent.stop="isDragover = false"
      @dragover.prevent.stop="isDragover = true"
      @dragenter.prevent.stop="isDragover = true"
      @dragleave.prevent.stop="isDragover = false"
      @drop.prevent.stop="upload"
    >
      <i class="fas fa-cloud-upload-alt text-3xl mb-2 text-gray-500"></i>
      <p>Glissez-déposez un MP3 ici</p>
      <p class="text-sm text-gray-500 my-2">ou</p>
      <input type="file" multiple accept="audio/mpeg" @change="upload" />
    </div>

    <div v-if="uploads.length" class="mt-4 space-y-2">
      <div v-for="upload in uploads" :key="upload.name" class="text-sm">
        <div class="flex justify-between">
          <span :class="upload.textClass">
            <i :class="upload.icon"></i>
            {{ upload.name }}
          </span>
        </div>
        <div class="w-full h-2 rounded bg-gray-200">
          <span
            class="block h-2 rounded"
            :class="upload.variant"
            :style="{ width: upload.currentProgress + '%' }"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { songsCollection, auth } from "@/includes/firebase";
import { supabase, SONGS_BUCKET } from "@/includes/supabase";

export default {
  name: "Upload",
  props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isDragover: false,
      uploads: [],
    };
  },
  methods: {
    upload(event) {
      this.isDragover = false;

      const files = event.dataTransfer
        ? [...event.dataTransfer.files]
        : [...event.target.files];

      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            currentProgress: 100,
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            textClass: "text-red-400",
          });
          return;
        }

        const uploadIndex =
          this.uploads.push({
            currentProgress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            textClass: "",
          }) - 1;

        // Le client Supabase ne fournit pas d'événement de progression natif pour
        // un upload simple : on simule une progression pour garder un retour visuel
        // pendant que la requête est en cours, puis on saute à 100% à la fin.
        const fakeProgress = setInterval(() => {
          if (this.uploads[uploadIndex].currentProgress < 90) {
            this.uploads[uploadIndex].currentProgress += 10;
          }
        }, 200);

        this.uploadToSupabase(file, uploadIndex, fakeProgress);
      });
    },
    async uploadToSupabase(file, uploadIndex, fakeProgress) {
      // Nettoie le nom de fichier : accents, espaces et caractères spéciaux
      // peuvent casser le chemin envoyé à Supabase Storage.
      const safeName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // retire les accents
        .replace(/[^a-zA-Z0-9.\-_]/g, "-") // remplace tout le reste par "-"
        .replace(/-+/g, "-"); // évite les tirets consécutifs

      const path = `${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(SONGS_BUCKET)
        .upload(path, file, { contentType: "audio/mpeg" });

      clearInterval(fakeProgress);

      if (uploadError) {
        this.uploads[uploadIndex].variant = "bg-red-400";
        this.uploads[uploadIndex].icon = "fas fa-times";
        this.uploads[uploadIndex].textClass = "text-red-400";
        console.log(uploadError);
        return;
      }

      this.uploads[uploadIndex].currentProgress = 100;
      this.uploads[uploadIndex].variant = "bg-green-400";
      this.uploads[uploadIndex].icon = "fas fa-check";
      this.uploads[uploadIndex].textClass = "text-green-400";

      const { data: publicUrlData } = supabase.storage.from(SONGS_BUCKET).getPublicUrl(path);

      const song = {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        originalName: path,
        modifiedName: file.name,
        genre: "",
        commentCount: 0,
        url: publicUrlData.publicUrl,
      };

      const songRef = await songsCollection.add(song);
      const songSnapshot = await songRef.get();

      this.addSong(songSnapshot);
    },
  },
};
</script>
