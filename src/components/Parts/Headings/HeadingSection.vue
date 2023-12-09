<script setup lang="ts">
interface Props {
  label: string;
}
defineProps<Props>()
</script>

<template>
  <h1 class="c-headingSection">
    {{ label }}
  </h1>
</template>

<style lang="scss">
	.c-headingSection {
		@include typo-heading-2-en();

		color: $color-font-white;
	}
</style>
