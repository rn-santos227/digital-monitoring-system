import type {
  CreateEquipmentIssuancePayload,
  EquipmentIssuanceListItem,
  EquipmentIssuanceSearchQuery,
  EquipmentIssuancesState,
  UpdateEquipmentIssuancePayload,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentIssuanceEndpoint,
  deleteEquipmentIssuanceEndpoint,
  getEquipmentIssuanceByIdEndpoint,
  getEquipmentIssuancesEndpoint,
  hasEquipmentIssuanceSearchFilters,
  searchEquipmentIssuancesEndpoint,
  updateEquipmentIssuanceEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_ISSUANCES_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

export const useEquipmentIssuancesStore = defineStore('equipment-issuances', {
  state: (): EquipmentIssuancesState => ({
    items: [],
    pagination: { ...DEFAULT_EQUIPMENT_ISSUANCES_PAGINATION },
    isLoading: false,
    error: '',
  }),

  getters: {
    hasEquipmentIssuances: (state) => state.items.length > 0,
  },

  actions: {

  },
})
