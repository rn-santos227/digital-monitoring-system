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

})
