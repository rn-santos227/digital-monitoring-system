import { defineStore } from 'pinia'
import type {
  CreateEquipmentItemPayload,
  EquipmentItemKpiCounts,
  EquipmentItemSearchQuery,
  EquipmentItemsState,
  UpdateEquipmentItemPayload,
} from '~/types/domain/equipment'
import { useEquipmentCategoriesStore } from '~/stores/equipment-categories'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentItemEndpoint,
  deleteEquipmentItemEndpoint,
  getEquipmentItemByIdEndpoint,
  getEquipmentItemKpisEndpoint,
  getEquipmentItemsEndpoint,
  hasEquipmentItemSearchFilters,
  searchEquipmentItemsEndpoint,
  updateEquipmentItemEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_ITEMS_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_ITEM_KPIS: EquipmentItemKpiCounts = {
  totalItems: 0,
}
