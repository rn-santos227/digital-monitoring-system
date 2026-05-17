<template>
  <main :class="SERVICE_STATUS_PAGE_MAIN_CLASSES">
    <header :class="SERVICE_STATUS_PAGE_HEADER_CLASSES">
      <h1 :class="SERVICE_STATUS_PAGE_TITLE_CLASSES">{{ SERVICE_STATUSES_PAGE_TITLE }}</h1>
      <p :class="SERVICE_STATUS_PAGE_SUBTITLE_CLASSES">{{ SERVICE_STATUSES_PAGE_SUBTITLE }}</p>
    </header>

    <BaseTab
      :model-value="activeTab"
      :items="SERVICE_STATUSES_PAGE_TAB_ITEMS"
      :aria-label="SERVICE_STATUSES_PAGE_TABS_ARIA_LABEL"
      @update:model-value="activeTab = $event"
    />

    <BaseAlert v-if="errorMessage" tone="danger" :message="errorMessage" />

    <BaseInlineLoader v-if="isLoading" message="Loading personnel locations..." />

    <template v-else>
      <section :class="SERVICE_STATUS_PAGE_CONTENT_CLASSES">
        <ServiceStatusTacticalMap
          :class="SERVICE_STATUS_PAGE_MAP_WRAPPER_CLASSES"
          :items="locationItems"
          :selected-personnel-id="selectedPersonnelId"
          @select="onSelectItem"
        />

        <details :class="SERVICE_STATUS_PAGE_DETAILS_CLASSES">
          <summary :class="SERVICE_STATUS_PAGE_DETAILS_SUMMARY_CLASSES">Personnel Location Feed</summary>
          <div :class="SERVICE_STATUS_PAGE_DETAILS_BODY_CLASSES">
            <ServiceStatusPersonnelTable :items="locationItems" @select="onSelectItem" />
          </div>
        </details>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseInlineLoader from '~/components/ui/BaseInlineLoader.vue'
import BaseTab from '~/components/ui/BaseTab.vue'
import ServiceStatusTacticalMap from '~/components/service-status/ServiceStatusTacticalMap.vue'
import {
  SERVICE_STATUS_PAGE_CONTENT_CLASSES,
  SERVICE_STATUS_PAGE_DETAILS_BODY_CLASSES,
  SERVICE_STATUS_PAGE_DETAILS_CLASSES,
  SERVICE_STATUS_PAGE_DETAILS_SUMMARY_CLASSES,
  SERVICE_STATUS_PAGE_HEADER_CLASSES,
  SERVICE_STATUS_PAGE_MAIN_CLASSES,
  SERVICE_STATUS_PAGE_MAP_WRAPPER_CLASSES,
  SERVICE_STATUS_PAGE_SUBTITLE_CLASSES,
  SERVICE_STATUS_PAGE_TITLE_CLASSES,
  SERVICE_STATUSES_PAGE_SUBTITLE,
  SERVICE_STATUSES_PAGE_TAB_ITEMS,
  SERVICE_STATUSES_PAGE_TABS_ARIA_LABEL,
  SERVICE_STATUSES_PAGE_TITLE,
} from '~/constants/page.constants'
import { fetchPersonnelLocationsEndpoint } from '~/utils/service-status-endpoints'
import type {  PersonnelLocationItem } from '~/types/domain/personnel'

const activeTab = ref('service-map')
const isLoading = ref(false)
const errorMessage = ref('')
const locationItems = ref<PersonnelLocationItem[]>([])
const selectedPersonnelId = ref<string | null>(null)

const onSelectItem = (item: PersonnelLocationItem) => {
  selectedPersonnelId.value = item.personnelId
}

const loadLocations = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    locationItems.value = await fetchPersonnelLocationsEndpoint()
    selectedPersonnelId.value = locationItems.value[0]?.personnelId ?? null
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load personnel locations.'
    errorMessage.value = message
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadLocations()
})
</script>
