import { defineStore } from 'pinia'
import type {
  CreateEquipmentIncidentPayload,
  EquipmentIncidentKpiCounts,
  EquipmentIncidentSearchQuery,
  EquipmentIncidentsState,
  UpdateEquipmentIncidentPayload,
} from '~/types/domain/incident'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentIncidentEndpoint,
  deleteEquipmentIncidentEndpoint,
  getEquipmentIncidentByIdEndpoint,
  getEquipmentIncidentKpisEndpoint,
  getEquipmentIncidentsEndpoint,
  hasEquipmentIncidentSearchFilters,
  searchEquipmentIncidentsEndpoint,
  updateEquipmentIncidentEndpoint,
} from '~/utils/incident-endpoints'


const DEFAULT_EQUIPMENT_INCIDENTS_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_INCIDENT_KPIS: EquipmentIncidentKpiCounts = {
  totalIncidents: 0,
  unresolvedIncidents: 0,
  incidentsThisMonth: 0,
}

export const useIncidentsStore = defineStore('incidents', {
  state: (): EquipmentIncidentsState => ({
    items: [],
    kpis: { ...DEFAULT_EQUIPMENT_INCIDENT_KPIS },
    hasLoadedKpis: false,
    pagination: { ...DEFAULT_EQUIPMENT_INCIDENTS_PAGINATION },
    isLoading: false,
    error: '',
  }),

  getters: {
    hasEquipmentIncidents: (state) => state.items.length > 0,
    equipmentIncidentKpis: (state) => state.kpis,
  },

  actions: {
    async fetchEquipmentIncidentKpisOnce(this: EquipmentIncidentsState) {
      if (this.hasLoadedKpis) return
      this.error = ''

      try {
        this.kpis = await getEquipmentIncidentKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_EQUIPMENT_INCIDENT_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment incident KPI counts.')
        throw error
      }
    },

    async fetchEquipmentIncidents(
      this: EquipmentIncidentsState,
      page = 1,
      filters: Partial<EquipmentIncidentSearchQuery> = {},
      pageSize?: number,
    ) {
      this.isLoading = true
      this.error = ''
      const resolvedPageSize = pageSize ?? this.pagination.pageSize
      const query = { ...filters, page, pageSize: resolvedPageSize }

      try {
        const response = hasEquipmentIncidentSearchFilters(query)
          ? await searchEquipmentIncidentsEndpoint(query)
          : await getEquipmentIncidentsEndpoint(query)

      } catch (error) {

      }
    },
  },
})
