import { defineStore } from 'pinia'
import type {
  CreateEquipmentIncidentPayload,
  EquipmentIncidentKpiCounts,
  EquipmentIncidentSearchQuery,
  EquipmentIncidentsState,
  UpdateEquipmentIncidentPayload,
  UpdateEquipmentIncidentDeploymentPayload,
  UpdateEquipmentIncidentDetailsPayload,
  UpdateEquipmentIncidentEquipmentPayload,
  UpdateEquipmentIncidentPersonnelPayload,
  UpdateEquipmentIncidentLocationPayload,
  UpdateEquipmentIncidentStatusPayload,
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
  updateEquipmentIncidentDeploymentEndpoint,
  updateEquipmentIncidentDetailsEndpoint,
  updateEquipmentIncidentEquipmentEndpoint,
  updateEquipmentIncidentPersonnelEndpoint,
  updateEquipmentIncidentLocationEndpoint,
  updateEquipmentIncidentStatusEndpoint,
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
    isCreating: false,
    isUpdating: false,
    error: '',
    createError: '',
    updateError: '',
  }),

  getters: {
    hasEquipmentIncidents: (state) => state.items.length > 0,
    equipmentIncidentKpis: (state) => state.kpis,
  },

  actions: {
    async fetchEquipmentIncidentKpisOnce(this: EquipmentIncidentsState) {
      if (this.hasLoadedKpis) return
      this.error = ''
      this.createError = ''
      this.isCreating = true
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
        this.createError = extractApiErrorMessage(error, 'Unable to create equipment incident.')
        this.error = this.createError
        throw error
      } finally {
        this.isCreating = false
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

    async updateEquipmentIncident(id: string, payload: UpdateEquipmentIncidentPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentEndpoint(id, payload))
    },

    async updateEquipmentIncidentDeployment(id: string, payload: UpdateEquipmentIncidentDeploymentPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentDeploymentEndpoint(id, payload))
    },

    async updateEquipmentIncidentDetails(id: string, payload: UpdateEquipmentIncidentDetailsPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentDetailsEndpoint(id, payload))
    },

    async updateEquipmentIncidentEquipment(id: string, payload: UpdateEquipmentIncidentEquipmentPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentEquipmentEndpoint(id, payload))
    },

    async updateEquipmentIncidentPersonnel(id: string, payload: UpdateEquipmentIncidentPersonnelPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentPersonnelEndpoint(id, payload))
    },

    async updateEquipmentIncidentLocation(id: string, payload: UpdateEquipmentIncidentLocationPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentLocationEndpoint(id, payload))
    },

    async updateEquipmentIncidentStatus(id: string, payload: UpdateEquipmentIncidentStatusPayload) {
      await this.updateEquipmentIncidentWithEndpoint(id, () => updateEquipmentIncidentStatusEndpoint(id, payload))
    },

    async updateEquipmentIncidentWithEndpoint(id: string, updateRequest: () => Promise<void>) {
      this.error = ''
      this.updateError = ''
      this.isUpdating = true
      try {
        await updateRequest()
        const item = await getEquipmentIncidentByIdEndpoint(id)
        this.items = this.items.map((currentItem) => (currentItem.id === id ? item : currentItem))
      } catch (error) {
        this.updateError = extractApiErrorMessage(error, 'Unable to update equipment incident.')
        this.error = this.updateError
        throw error
      } finally {
        this.isUpdating = false
      }
    },

    async deleteEquipmentIncident(this: EquipmentIncidentsState, id: string) {
      this.error = ''
      try {
        await deleteEquipmentIncidentEndpoint(id)
        const previousLength = this.items.length
        this.items = this.items.filter((item) => item.id !== id)
        const deletedCount = previousLength - this.items.length
        if (deletedCount <= 0) return

        this.pagination.totalItems = Math.max(0, this.pagination.totalItems - deletedCount)
        this.pagination.totalPages = this.pagination.totalItems === 0
          ? 0
          : Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize))
        if (this.hasLoadedKpis) this.kpis.totalIncidents = Math.max(0, this.kpis.totalIncidents - deletedCount)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete equipment incident.')
        throw error
      }
    },
  },
})
