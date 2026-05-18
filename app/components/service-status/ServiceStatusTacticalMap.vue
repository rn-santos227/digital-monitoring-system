<template>
  <BaseCard :class="SERVICE_STATUS_TACTICAL_CARD_CLASSES">

  </BaseCard>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import {
  SERVICE_STATUS_TACTICAL_CARD_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_BUTTON_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_LIST_CLASSES,
  SERVICE_STATUS_TACTICAL_CLUSTER_TITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_HEADER_CLASSES,
  SERVICE_STATUS_TACTICAL_MAP_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_LABEL_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_TITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_VALUE_CLASSES,
  SERVICE_STATUS_TACTICAL_PANEL_VALUE_PRIMARY_CLASSES,
  SERVICE_STATUS_TACTICAL_SUBTITLE_CLASSES,
  SERVICE_STATUS_TACTICAL_TITLE_CLASSES,
} from '~/constants/ui.constants'
import serviceStatusPinIcon from '~/assets/icons/service-status-pin.svg'
import { useGeoMap } from '~/composables/useGeoMap'
import { loadLeafletApi } from '~/utils/geo-map'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
</script>
