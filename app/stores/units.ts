import { defineStore } from 'pinia'
import type { UnitManagementKpis, UnitManagementKpisState } from '~/types/domain/units'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getUnitManagementPageKpisEndpoint } from '~/utils/units-endpoints'

const DEFAULT_UNIT_MANAGEMENT_KPIS: UnitManagementKpis = {
  totalCompanies: 0,
  totalBattalions: 0,
  totalUnassignedPersonnel: 0,
}

const unitManagementKpisStoreOptions = {
  state: (): UnitManagementKpisState => ({
    kpis: { ...DEFAULT_UNIT_MANAGEMENT_KPIS },
    hasLoadedKpis: false,
    isLoading: false,
    error: '',
  }),

  getters: {
    unitManagementKpis: (state: UnitManagementKpisState) => state.kpis,
  },

  actions: {
    async fetchUnitManagementKpisOnce(this: UnitManagementKpisState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.isLoading = true
      this.error = ''

      try {
        this.kpis = await getUnitManagementPageKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_UNIT_MANAGEMENT_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch unit management KPI counts.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    applyBattalionKpiDelta(this: UnitManagementKpisState, delta: 1 | -1) {
      if (!this.hasLoadedKpis) {
        return
      }

      this.kpis = {
        ...this.kpis,
        totalBattalions: Math.max(0, this.kpis.totalBattalions + delta),
      }
    },

    applyCompanyKpiDelta(this: UnitManagementKpisState, delta: 1 | -1) {
      if (!this.hasLoadedKpis) {
        return
      }

      this.kpis = {
        ...this.kpis,
        totalCompanies: Math.max(0, this.kpis.totalCompanies + delta),
      }
    },

    applyUnassignedPersonnelKpiDelta(this: UnitManagementKpisState, delta: 1 | -1) {
      if (!this.hasLoadedKpis) {
        return
      }

      this.kpis = {
        ...this.kpis,
        totalUnassignedPersonnel: Math.max(0, this.kpis.totalUnassignedPersonnel + delta),
      }
    },
  },
}

export const useUnitManagementKpisStore = defineStore('unit-management-kpis', unitManagementKpisStoreOptions)
