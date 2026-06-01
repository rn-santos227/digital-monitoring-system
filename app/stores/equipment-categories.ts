import { defineStore } from 'pinia'
import type {
  CreateEquipmentCategoryPayload,
  EquipmentCategoriesState,
  EquipmentCategoryKpiCounts,
  EquipmentCategorySearchQuery,
  UpdateEquipmentCategoryPayload,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentCategoryEndpoint,
  deleteEquipmentCategoryEndpoint,
  getEquipmentCategoriesEndpoint,
  getEquipmentCategoryByIdEndpoint,
  getEquipmentCategoryKpisEndpoint,
  hasEquipmentCategorySearchFilters,
  searchEquipmentCategoriesEndpoint,
  updateEquipmentCategoryEndpoint,
} from '~/utils/equipment-endpoints'

const DEFAULT_EQUIPMENT_CATEGORIES_PAGINATION = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_EQUIPMENT_CATEGORY_KPIS: EquipmentCategoryKpiCounts = {
  totalCategories: 0,
  unusedCategories: 0,
}

