<script setup lang="ts">
interface Props {
  label: string
}
defineProps<Props>()
</script>

<template>
  <h1 class="c-overlayModal">
    {{ label }}
  </h1>
</template>

<style lang="scss">
	.c-overlayModal {
		//
	}
</style>