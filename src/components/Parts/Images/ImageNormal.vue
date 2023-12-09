<script setup lang="ts">
interface Props {
  src: string
  alt: string
  width?: number
  height?: number
}
defineProps<Props>()
</script>

<template>
  <div class="c-imageNormal">
    <img
      :src="src"
      :width="width"
      :height="height"
      :alt="alt"
    >
  </div>
</template>

<style lang="scss">
	.c-imageNormal {
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
    }
	}
</style>
