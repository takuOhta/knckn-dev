<script setup lang="ts">
import { BREADCRUMBS } from "@constants/breadcrumbs"
import type { BREADCRUMBS_KEYS, BREADCRUMBS_VALUES } from "@tsTypes/schema"
interface Props {
  id: BREADCRUMBS_KEYS
}
const props = defineProps<Props>()
const data: BREADCRUMBS_VALUES = BREADCRUMBS[props.id as BREADCRUMBS_KEYS]
const breadcrumbsList = `
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": ${ data }
  }
`
</script>

<template>
  <script
    type="application/ld+json"
    v-html="breadcrumbsList"
  />
</template>
