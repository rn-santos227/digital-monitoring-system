import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import {
  createEquipmentCategoryEndpoint,
  deleteEquipmentCategoryEndpoint,
  getEquipmentCategoriesEndpoint,
  getEquipmentCategoryByIdEndpoint,
  searchEquipmentCategoriesEndpoint,
  updateEquipmentCategoryEndpoint,
} from '~/utils/equipment-endpoints'
import type {
  CreateEquipmentCategoryPayload,
  EquipmentCategoriesState,
  EquipmentCategorySearchQuery,
  UpdateEquipmentCategoryPayload,
} from '~/types/domain/equipment'
