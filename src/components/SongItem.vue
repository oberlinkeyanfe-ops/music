<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition hover:bg-gray-50">
    <div>
      <a href="#" class="font-bold block text-gray-600" @click.prevent="play">{{ song.modifiedName }}</a>
      <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
    </div>
    <div class="text-gray-600 text-lg">
      <RouterLink :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }" custom v-slot="{ navigate }">
        <span class="comments cursor-pointer" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.commentCount }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>

<script>
import { mapActions } from "pinia";
import { usePlayerStore } from "@/stores/player";

export default {
  name: "SongItem",
  props: {
    song: { type: Object, required: true },
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    play() {
      this.newSong(this.song);
    },
  },
};
</script>
