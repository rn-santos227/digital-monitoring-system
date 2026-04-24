<template>
  <TemporaryRoutePage
    :title="TEMPORARY_ROUTE_PAGE_CONTENT.equipmentCategories.title"
    :subtitle="TEMPORARY_ROUTE_PAGE_CONTENT.equipmentCategories.subtitle"
    :feature-label="TEMPORARY_ROUTE_PAGE_CONTENT.equipmentCategories.featureLabel"
  />
</template>

<script setup lang="ts">
import TemporaryRoutePage from '~/components/general/TemporaryRoutePage.vue'
import { TEMPORARY_ROUTE_PAGE_CONTENT } from '~/constants/page.constants'
</script>
