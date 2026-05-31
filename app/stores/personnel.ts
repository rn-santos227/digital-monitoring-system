import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { mapParsedBatchRowToCreatePayload, parsePersonnelBatchExcelFile } from '~/utils/personnel-batch-upload'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
import type {
  CreatePersonnelPayload,
  UpdatePersonnelPayload,
  PersonnelDetail,
  PersonnelEndpointQuery,
  PersonnelKpiCounts,
  PersonnelListCompactItem,
  PersonnelSearchQuery,
  PersonnelState,
  PersonnelTablePagination,
} from '~/types/domain/personnel'
import {
  createPersonnelEndpoint,
  deletePersonnelEndpoint,
  getPersonnelByIdEndpoint,
  getPersonnelKpisEndpoint,
  getPersonnelEndpoint,
  searchPersonnelEndpoint,
  updatePersonnelEndpoint,
} from '~/utils/personnel-endpoints'

const DEFAULT_PAGINATION: PersonnelTablePagination = {
  page: 1,
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_PERSONNEL_KPIS: PersonnelKpiCounts = {
  totalPersonnel: 0,
  deployedPersonnel: 0,
  totalRanks: 0,
  unusedRanks: 0,
}

const INITIAL_PERSONNEL_STATE: PersonnelState = {
  items: [],
  kpis: { ...DEFAULT_PERSONNEL_KPIS },
  hasLoadedKpis: false,
  pagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: '',
}

const isDeployedPersonnel = (item: Pick<PersonnelListCompactItem, 'serviceStatus'> | null | undefined) => {
  return item?.serviceStatus.trim().toLowerCase().includes('deployed') ?? false
}

const applyPersonnelKpiDelta = (
  kpis: PersonnelKpiCounts,
  item: PersonnelListCompactItem,
  delta: 1 | -1,
): PersonnelKpiCounts => {
  const totalPersonnel = Math.max(0, kpis.totalPersonnel + delta)
  const deployedPersonnel = Math.max(0, kpis.deployedPersonnel + (isDeployedPersonnel(item) ? delta : 0))

  return {
    ...kpis,
    totalPersonnel,
    deployedPersonnel,
  }
}

const applyPersonnelDeploymentTransition = (
  kpis: PersonnelKpiCounts,
  previousItem: PersonnelListCompactItem,
  nextItem: Pick<PersonnelListCompactItem, 'serviceStatus'>,
): PersonnelKpiCounts => {
  const wasDeployed = isDeployedPersonnel(previousItem)
  const isDeployed = isDeployedPersonnel(nextItem)

  if (wasDeployed === isDeployed) {
    return kpis
  }

  return {
    ...kpis,
    deployedPersonnel: Math.max(0, kpis.deployedPersonnel + (isDeployed ? 1 : -1)),
  }
}

const personnelStoreOptions = {
  state: (): PersonnelState => ({
    ...INITIAL_PERSONNEL_STATE,
    kpis: { ...DEFAULT_PERSONNEL_KPIS },
    pagination: { ...DEFAULT_PAGINATION },
  }),

  getters: {
    hasPersonnelItems: (state: PersonnelState) => state.items.length > 0,
    personnelKpis: (state: PersonnelState) => state.kpis,
  },

  actions: {
    async fetchPersonnelKpisOnce(this: PersonnelState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.error = ''

      try {
        this.kpis = await getPersonnelKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_PERSONNEL_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch personnel KPI counts.')
        throw error
      }
    },

    applyRankKpiDelta(this: PersonnelState, delta: 1 | -1) {
      if (!this.hasLoadedKpis) {
        return
      }

      this.kpis = {
        ...this.kpis,
        totalRanks: Math.max(0, this.kpis.totalRanks + delta),
        unusedRanks: Math.max(0, this.kpis.unusedRanks + delta),
      }
    },

    async fetchPersonnel(this: PersonnelState, page = 1, filters: Partial<PersonnelSearchQuery> = {}, pageSize = this.pagination.pageSize) {
      this.isLoading = true
      this.error = ''

      const requestQuery: PersonnelSearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
      }

      const hasSearchFilters = Boolean(requestQuery.term)

      try {
        if (hasSearchFilters) {
          const response = await searchPersonnelEndpoint(requestQuery)
          this.items = response.items.map((item): PersonnelListCompactItem => ({
            id: item.id,
            personnelCode: item.personnelCode,
            serviceNumber: item.serviceNumber,
            email: item.email,
            fullName: item.fullName,
            rankName: item.rankName,
            companyName: item.companyName,
            battalionName: item.battalionName,
            serviceStatus: item.serviceStatus,
          }))
          this.pagination = {
            page: response.page,
            pageSize: response.pageSize,
            totalItems: response.totalItems,
            totalPages: response.totalPages,
          }
          return
        }

        const response = await getPersonnelEndpoint(requestQuery as PersonnelEndpointQuery)
        this.items = response.items.map((item): PersonnelListCompactItem => ({
          id: item.id,
          personnelCode: item.personnelCode,
          serviceNumber: item.serviceNumber,
          email: item.email,
          fullName: item.fullName,
          rankName: item.rankName,
          companyName: item.companyName,
          battalionName: item.battalionName,
          serviceStatus: item.serviceStatus,
        }))
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.items = []
        this.pagination = { ...DEFAULT_PAGINATION, pageSize: resolveDefaultFetchPageSize() }
        this.error = extractApiErrorMessage(error, 'Unable to fetch personnel records.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createPersonnel(this: PersonnelState, payload: CreatePersonnelPayload) {
      this.isLoading = true
      this.error = ''

      try {
        const response = await createPersonnelEndpoint(payload)
        const createdPersonnelListItem: PersonnelListCompactItem = response.item

        this.items = [createdPersonnelListItem, ...this.items]
        this.pagination.totalItems += 1
        this.pagination.totalPages = Math.max(1, Math.ceil(this.pagination.totalItems / this.pagination.pageSize))

        if (this.hasLoadedKpis) {
          this.kpis = applyPersonnelKpiDelta(this.kpis, createdPersonnelListItem, 1)
        }

        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create personnel record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async processPersonnelBatchUpload(
      this: PersonnelState,
      file: File,
      employmentStatusId: string,
      serviceStatusId: string,
      onProgress?: (processedCount: number, totalCount: number) => void,
    ) {
      this.isLoading = true
      this.error = ''

      try {
        const parsedRows = await parsePersonnelBatchExcelFile(file)
        let insertedCount = 0
        let processedCount = 0

        for (const row of parsedRows) {
          const payload = mapParsedBatchRowToCreatePayload(row, employmentStatusId, serviceStatusId)

          try {
            await createPersonnelEndpoint(payload)
            insertedCount += 1
          } catch {
            // Continue processing the remaining rows.
          } finally {
            processedCount += 1
            onProgress?.(processedCount, parsedRows.length)
          }
        }

        if (this.hasLoadedKpis && insertedCount > 0) {
          this.kpis = {
            ...this.kpis,
            totalPersonnel: this.kpis.totalPersonnel + insertedCount,
          }
        }

        return {
          insertedCount,
          totalCount: parsedRows.length,
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to process personnel batch upload.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchPersonnelById(this: PersonnelState, id: string): Promise<PersonnelDetail> {
      this.error = ''

      try {
        return await getPersonnelByIdEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to fetch personnel profile details.')
        throw error
      }
    },

    async updatePersonnel(this: PersonnelState, id: string, payload: UpdatePersonnelPayload) {
      this.error = ''
      const previousPersonnel = this.items.find((item) => item.id === id) ?? null

      try {
        const response = await updatePersonnelEndpoint(id, payload)
        const updatedPersonnel = await getPersonnelByIdEndpoint(id)

        this.items = this.items.map((item): PersonnelListCompactItem => {
          if (item.id !== id) {
            return item
          }

          return {
            id,
            personnelCode: updatedPersonnel.personnelCode,
            serviceNumber: updatedPersonnel.serviceNumber,
            email: updatedPersonnel.email,
            fullName: `${updatedPersonnel.lastName}, ${updatedPersonnel.firstName}${updatedPersonnel.middleName ? ` ${updatedPersonnel.middleName}` : ''}`,
            rankName: updatedPersonnel.rankName,
            companyName: updatedPersonnel.companyName,
            battalionName: updatedPersonnel.battalionName,
            serviceStatus: updatedPersonnel.serviceStatus,
          }
        })

        if (this.hasLoadedKpis && previousPersonnel) {
          this.kpis = applyPersonnelDeploymentTransition(this.kpis, previousPersonnel, {
            serviceStatus: updatedPersonnel.serviceStatus,
          })
        }

        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update personnel record.')
        throw error
      }
    },

    async deletePersonnel(this: PersonnelState, id: string) {
      this.isLoading = true
      this.error = ''

      try {
        const response = await deletePersonnelEndpoint(id)
        const deletedPersonnel = this.items.find(item => item.id === id) ?? null
        const nextItems = this.items.filter(item => item.id !== id)

        if (nextItems.length !== this.items.length) {
          this.items = nextItems
          this.pagination.totalItems = Math.max(0, this.pagination.totalItems - 1)
          this.pagination.totalPages = this.pagination.totalItems === 0
            ? 0
            : Math.ceil(this.pagination.totalItems / this.pagination.pageSize)

          if (this.hasLoadedKpis && deletedPersonnel) {
            this.kpis = applyPersonnelKpiDelta(this.kpis, deletedPersonnel, -1)
          }
        }

        return response
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete personnel record.')
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
}

export const usePersonnelStore = defineStore('personnel', personnelStoreOptions)
