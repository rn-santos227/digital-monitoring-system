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


