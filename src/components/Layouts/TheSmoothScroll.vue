<script setup lang="ts">
import { onMounted } from 'vue';
import { smoothScroll } from '@scripts/SmoothScroll/SmoothScroll'

// マウント後に実行
onMounted(() => {
  smoothScroll.init(
    document.querySelector('[data-smooth-scroll="wrap"]') as HTMLElement,
  )
})
</script>

<template>
  <div data-smooth-scroll="wrap">
    <slot />
  </div>
</template>

<style lang="scss">
	
</style>