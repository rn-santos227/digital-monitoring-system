import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCompaniesStore } from '~/stores/companies'
import type { CompanySearchQuery } from '~/types/domain/units'

export const useCompanies = () => {
  const companiesStore = useCompaniesStore()
  const { items, pagination, isLoading, error } = storeToRefs(companiesStore)
  const filters = ref<Partial<CompanySearchQuery>>({})

  const tableRows = computed(() => {
    return items.value.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      battalion: item.battalionName ?? item.battalionCode ?? 'Unassigned',
      status: item.isActive ? 'Active' : 'Inactive',
    }))
  })

  const loadCompanies = async (page = pagination.value.page, nextFilters: Partial<CompanySearchQuery> = filters.value) => {
    filters.value = { ...nextFilters }

    try {
      await companiesStore.fetchCompanies(page, filters.value)
    } catch {
      // Error state is exposed from the store.
    }
  }

  onMounted(() => {
    void loadCompanies(1)
  })

  return {
    filters,
    tableRows,
    pagination,
    isLoading,
    error,
    loadCompanies,
    createCompany: companiesStore.createCompany,
    getCompanyById: companiesStore.getCompanyById,
    updateCompany: companiesStore.updateCompany,
    deleteCompany: companiesStore.deleteCompany,
  }
}
