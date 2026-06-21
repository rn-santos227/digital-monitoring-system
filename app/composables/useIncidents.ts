import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useIncidentsStore } from '~/stores/incidents'
import type { EquipmentIncidentSearchQuery, EquipmentIncidentTableRow } from '~/types/domain/incident'
import { hasEquipmentIncidentSearchFilters } from '~/utils/incident-endpoints'


