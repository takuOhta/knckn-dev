<script setup lang="ts">
	
</script>

<template>
  <header class="t-header">
    <div class="t-header-inner">
      <h1 class="siteTitle">
        Astro
      </h1>
	
      <nav class="navi">
        <ul class="navi-list">
          <li class="navi-list-item">
            <a
              href="/"
              class="navi-list-item-inner"
            >TOP</a>
          </li>
          <li class="navi-list-item">
            <a
              href="/about/"
              class="navi-list-item-inner"
            >ABOUT</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style lang="scss">
	.t-header {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 5;

		&-inner {
			// @include media-pc {
				padding: size-variable-pc(50);
			// }

			.siteTitle {
				@include font-size-variable-pc(40, 16);

				color: $color-font-white;
			}

			.navi {
				&-list {
					display: flex;
					justify-content: flex-end;
					&-item {
						margin-left: size-variable-pc(30);

						&-inner {
							@include font-size-variable-pc(14, 12);

							color: $color-font-white;
							line-height: 1;
						}
					}
				}
			}
		}
	}
</style>