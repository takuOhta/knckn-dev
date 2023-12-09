<script setup lang="ts">

</script>

<template>
  <section class="c-sectionNormal">
    <div class="c-sectionNormal-inner">
      <slot />
    </div>
  </section>
</template>

<style lang="scss">
.c-sectionNormal {
  width: 100%;
  min-height: 100vh;
}

.c-sectionNormal-inner {
  @include full();
  @include flex-center();
}
</style>