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


