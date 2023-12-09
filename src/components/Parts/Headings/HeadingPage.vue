<script setup lang="ts">
interface Props {
  label: string;
}
defineProps<Props>()
</script>

<template>
  <h1 class="c-headingPage">
    {{ label }}
  </h1>
</template>

<style lang="scss">
	.c-headingPage {
		@include typo-heading-1-en();
	}
</style>