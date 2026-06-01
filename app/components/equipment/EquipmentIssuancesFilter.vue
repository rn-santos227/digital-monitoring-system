<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  EQUIPMENT_ISSUANCES_FILTER_APPLY_LABEL,
  EQUIPMENT_ISSUANCES_FILTER_CARD_TITLE,
  EQUIPMENT_ISSUANCES_FILTER_RESET_LABEL,
  EQUIPMENT_ISSUANCES_FILTER_TERM_LABEL,
  EQUIPMENT_ISSUANCES_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'
import type { EquipmentIssuanceSearchQuery } from '~/types/domain/equipment'
</script>
