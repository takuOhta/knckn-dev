<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  label: string
}
const props = defineProps<Props>()
// variables
let count = ref(0)

// functions
const onClick = () => {
  count.value++
}
</script>

<template>
  <div
    class="c-buttonBox"
    @click="onClick"
  >
    <span class="c-buttonBox-label">{{ `${ label }${ count }` }}</span>
  </div>
</template>

<style lang="scss">
	.c-buttonBox {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-top: 400px;
		// background-color: $color-bg-black;
		cursor: pointer;

		@include media-pc {
			padding: size-variable-pc(16) size-variable-pc(56);
			border-radius: size-variable-pc(6);
		}
		@include media-sp {
			padding: size-variable-sp(16) size-variable-sp(56);
			border-radius: size-variable-sp(6);
		}
	}
</style>
