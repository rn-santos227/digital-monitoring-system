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


