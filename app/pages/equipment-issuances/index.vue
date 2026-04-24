<template>
  <TemporaryRoutePage
    :title="TEMPORARY_ROUTE_PAGE_CONTENT.equipmentIssuances.title"
    :subtitle="TEMPORARY_ROUTE_PAGE_CONTENT.equipmentIssuances.subtitle"
    :feature-label="TEMPORARY_ROUTE_PAGE_CONTENT.equipmentIssuances.featureLabel"
  />
</template>

<script setup lang="ts">
import TemporaryRoutePage from '~/components/general/TemporaryRoutePage.vue'
import { TEMPORARY_ROUTE_PAGE_CONTENT } from '~/constants/page.constants'
</script>
