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
        this.items = response.items
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.items = []
        this.pagination = { ...DEFAULT_EQUIPMENT_INCIDENTS_PAGINATION, pageSize: resolveDefaultFetchPageSize() }
        this.error = extractApiErrorMessage(error, 'Unable to fetch equipment incidents.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createEquipmentIncident(this: EquipmentIncidentsState, payload: CreateEquipmentIncidentPayload) {
      this.error = ''
      try {
        const response = await createEquipmentIncidentEndpoint(payload)
        this.items = [response.item, ...this.items]
        this.pagination.totalItems += 1
        this.pagination.totalPages = Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize))
        if (this.hasLoadedKpis) this.kpis.totalIncidents += 1
        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create equipment incident.')
        throw error
      }
    },

    async getEquipmentIncidentById(this: EquipmentIncidentsState, id: string) {
      this.error = ''
      try {
        return await getEquipmentIncidentByIdEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load equipment incident details.')
        throw error
      }
    },

    async updateEquipmentIncident(this: EquipmentIncidentsState, id: string, payload: UpdateEquipmentIncidentPayload) {
      this.error = ''
      try {

      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update equipment incident.')
        throw error
      }
    },
  },
})
