<template>
  <div v-if="currentSong.modifiedName" class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full border-t border-gray-200">
    <div class="text-center text-sm">
      <span class="font-bold">{{ currentSong.modifiedName }}</span> par
      <span>{{ currentSong.displayName }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <button id="player-play-button" type="button" @click="toggleAudio">
        <i class="fa text-gray-500 text-xl" :class="playing ? 'fa-pause' : 'fa-play'"></i>
      </button>
      <div>{{ seek }}</div>
      <div class="w-full h-2 rounded bg-gray-200 relative cursor-pointer" @click="updateSeek">
        <span class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg" :style="{ left: playerProgress }">
          <i class="fas fa-circle"></i>
        </span>
        <span class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400" :style="{ width: playerProgress }"></span>
      </div>
      <div>{{ duration }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { usePlayerStore } from "@/stores/player";

export default {
  name: "Player",
  computed: {
    ...mapState(usePlayerStore, ["currentSong", "seek", "duration", "playerProgress", "playing"]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["toggleAudio", "updateSeek"]),
  },
};
</script>
