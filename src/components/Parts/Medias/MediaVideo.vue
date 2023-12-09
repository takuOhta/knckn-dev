<script setup lang="ts">
interface Props {
  src: string
  poster: string
}
defineProps<Props>()
</script>

<template>
  <div class="c-mediaVideo">
    <video
      :src="src"
      :poster="poster"
      class="c-video"
      width="1"
      height="1"
      muted
      preload="auto"
      playsinline
    />
  </div>
</template>

<style lang="scss">
	.c-mediaVideo {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 50%;
	}
</style>
