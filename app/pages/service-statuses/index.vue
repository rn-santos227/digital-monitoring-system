<template>
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


</script>
