import type { Ref } from 'vue'
import type { TablePaginationState } from '~/constants/ui.constants'
import type {
  EquipmentItemBattalionUsageListItem,
  EquipmentItemCompanyUsageListItem,
  EquipmentItemListItem,
  EquipmentItemPersonnelUsageListItem,
} from '~/types/domain/equipment'
import {
  getEquipmentItemBattalionsEndpoint,
  getEquipmentItemByIdEndpoint,
  getEquipmentItemCompaniesEndpoint,
  getEquipmentItemPersonnelEndpoint,
} from '~/utils/equipment-endpoints'

interface UseEquipmentItemProfileLoaderOptions {
  equipmentItemId: Readonly<Ref<string>>
  equipmentItem: Ref<EquipmentItemListItem | null>
  personnelRows: Ref<EquipmentItemPersonnelUsageListItem[]>
  companyRows: Ref<EquipmentItemCompanyUsageListItem[]>
  battalionRows: Ref<EquipmentItemBattalionUsageListItem[]>
  personnelPagination: Ref<TablePaginationState>
  companyPagination: Ref<TablePaginationState>
  battalionPagination: Ref<TablePaginationState>
  isLoadingPersonnel: Ref<boolean>
  isLoadingCompanies: Ref<boolean>
  isLoadingBattalions: Ref<boolean>
}

export const useEquipmentItemProfileLoader = ({
  equipmentItemId,
  equipmentItem,
  personnelRows,
  companyRows,
  battalionRows,
  personnelPagination,
  companyPagination,
  battalionPagination,
  isLoadingPersonnel,
  isLoadingCompanies,
  isLoadingBattalions,
}: UseEquipmentItemProfileLoaderOptions) => {
  const applyPagination = (target: typeof personnelPagination, response: TablePaginationState) => {
    target.value = {
      page: response.page,
      pageSize: response.pageSize,
      totalItems: response.totalItems,
      totalPages: response.totalPages,
    }
  }

  const loadPersonnelUsage = async (page = personnelPagination.value.page, pageSize = personnelPagination.value.pageSize) => {
    const id = equipmentItemId.value

    if (!id) {
      return
    }

    isLoadingPersonnel.value = true

    try {
      const response = await getEquipmentItemPersonnelEndpoint(id, { page, pageSize })
      personnelRows.value = response.items
      applyPagination(personnelPagination, response)
    } finally {
      isLoadingPersonnel.value = false
    }
  }

  const loadCompanyUsage = async (page = companyPagination.value.page, pageSize = companyPagination.value.pageSize) => {
    const id = equipmentItemId.value

    if (!id) {
      return
    }

    isLoadingCompanies.value = true

    try {
      const response = await getEquipmentItemCompaniesEndpoint(id, { page, pageSize })
      companyRows.value = response.items
      applyPagination(companyPagination, response)
    } finally {
      isLoadingCompanies.value = false
    }
  }

  const loadBattalionUsage = async (page = battalionPagination.value.page, pageSize = battalionPagination.value.pageSize) => {
    const id = equipmentItemId.value

    if (!id) {
      return
    }

    isLoadingBattalions.value = true

    try {
      const response = await getEquipmentItemBattalionsEndpoint(id, { page, pageSize })
      battalionRows.value = response.items
      applyPagination(battalionPagination, response)
    } finally {
      isLoadingBattalions.value = false
    }
  }

  const loadEquipmentItemProfile = async (id: string) => {
    const response = await getEquipmentItemByIdEndpoint(id)
    equipmentItem.value = response.item
    await Promise.all([
      loadPersonnelUsage(1, personnelPagination.value.pageSize),
      loadCompanyUsage(1, companyPagination.value.pageSize),
      loadBattalionUsage(1, battalionPagination.value.pageSize),
    ])
  }

  return {
    loadPersonnelUsage,
    loadCompanyUsage,
    loadBattalionUsage,
    loadEquipmentItemProfile,
  }
}
