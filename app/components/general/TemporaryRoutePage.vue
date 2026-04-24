<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="TEMPORARY_ROUTE_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ title }}</h1>
        <p class="text-sm text-slate-600">{{ subtitle }}</p>
      </header>

      <BaseCard>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold text-slate-900">Temporary Page</h2>
          <p class="text-sm text-slate-600">
            This route is scaffolded for navigation completeness and will be replaced with the full
            {{ featureLabel }} module implementation.
          </p>
        </div>
      </BaseCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import { TEMPORARY_ROUTE_PAGE_SECTION_CLASSES } from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'

defineProps<{
  title: string
  subtitle: string
  featureLabel: string
}>()
</script>
