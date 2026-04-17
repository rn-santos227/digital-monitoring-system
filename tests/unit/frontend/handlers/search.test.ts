import { ref, type Ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useBattalionSearchHandlers } from '@/app/handlers/battalions/search.handler'
import { useCompanySearchHandlers } from '@/app/handlers/companies/search.handler'
import { usePersonnelSearchHandlers } from '@/app/handlers/personnel/search.handler'
import { useRankSearchHandlers } from '@/app/handlers/ranks/search.handler'
import {
  useEquipmentSearchHandlers,
  useEquipmentCategorySearchHandlers,
} from '@/app/handlers/equipment/search.handler'
import { useIncidentSearchHandlers } from '@/app/handlers/incidents/search.handler'
import { useTrainingSearchHandlers } from '@/app/handlers/trainings/search.handler'
import { useUsersSearchHandlers } from '@/app/handlers/users/search.handler'
import { useDeploymentSearchHandlers } from '@/app/handlers/deployments/search.handler'
import { useEngagementSearchHandlers } from '@/app/handlers/engagements/search.handler'
import { useAuditSearchHandlers } from '@/app/handlers/audit/search.handler'

interface SearchController {
  apply: (input: Record<string, unknown>) => {
    filters: Record<string, unknown>
    errors: Record<string, unknown>
    isValid: boolean
  }
  reset: () => Record<string, unknown>
}
interface Contract {
  name: string
  create: (filters: Ref<Record<string, unknown>>) => SearchController
  field?: string
  advanced?: boolean
}
const contracts: Contract[] = [
  {
    name: 'battalions',
    field: 'name',
    advanced: true,
    create: (filters) => {
      const h = useBattalionSearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'companies',
    field: 'code',
    advanced: true,
    create: (filters) => {
      const h = useCompanySearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'personnel',
    field: 'firstName',
    advanced: true,
    create: (filters) => {
      const h = usePersonnelSearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'ranks',
    field: 'name',
    advanced: true,
    create: (filters) => {
      const h = useRankSearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'equipment',
    field: 'equipmentCode',
    advanced: true,
    create: (filters) => {
      const h = useEquipmentSearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'equipment categories',
    field: 'name',
    advanced: true,
    create: (filters) => {
      const h = useEquipmentCategorySearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'incidents',
    advanced: true,
    create: (filters) => {
      const h = useIncidentSearchHandlers(filters)
      return { apply: h.handleFilterApply, reset: h.handleFilterReset }
    },
  },
  {
    name: 'training records',
    field: 'recordNo',
    create: (filters) => {
      const h = useTrainingSearchHandlers(filters, ref({}), ref({}))
      return {
        apply: h.handleRecordsFilterApply,
        reset: h.handleRecordsFilterReset,
      }
    },
  },
  {
    name: 'trainings',
    field: 'trainingTitle',
    create: (filters) => {
      const h = useTrainingSearchHandlers(ref({}), filters, ref({}))
      return {
        apply: h.handleTrainingFilterApply,
        reset: h.handleTrainingFilterReset,
      }
    },
  },
  {
    name: 'training categories',
    field: 'name',
    create: (filters) => {
      const h = useTrainingSearchHandlers(ref({}), ref({}), filters)
      return {
        apply: h.handleCategoryFilterApply,
        reset: h.handleCategoryFilterReset,
      }
    },
  },
  {
    name: 'user profiles',
    field: 'fullName',
    advanced: true,
    create: (filters) => {
      const h = useUsersSearchHandlers(filters, ref({}))
      return {
        apply: h.handleProfileFilterApply,
        reset: h.handleProfileFilterReset,
      }
    },
  },
  {
    name: 'account types',
    field: 'description',
    advanced: true,
    create: (filters) => {
      const h = useUsersSearchHandlers(ref({}), filters)
      return {
        apply: h.handleAccountFilterApply,
        reset: h.handleAccountFilterReset,
      }
    },
  },
  {
    name: 'engagements',
    field: 'engagementTitle',
    advanced: true,
    create: (filters) => {
      const h = useEngagementSearchHandlers(filters)
      return {
        apply: h.handleEngagementFilterApply,
        reset: h.handleEngagementFilterReset,
      }
    },
  },
]

describe.each(contracts)('$name search controls', (contract) => {
  it('trims search terms and resets stale filters', () => {
    const filters = ref<Record<string, unknown>>({ term: 'Old' })
    const controller = contract.create(filters)
    const result = controller.apply({
      term: ' Unit 1 ',
      ...(contract.field ? { fields: contract.field } : {}),
    })
    expect(result.isValid).toBe(true)
    expect(result.filters.term).toBe('Unit 1')
    if (contract.field) expect(result.filters.fields).toBe(contract.field)
    expect(controller.reset()).toEqual({})
    expect(filters.value).toEqual({})
  })

  it.each(['<script>', 'x'.repeat(121)])(
    'rejects unsafe or oversized terms',
    (term) => {
      const result = contract.create(ref({})).apply({ term })
      expect(result.isValid).toBe(false)
      expect(result.errors.term).toBeTruthy()
    },
  )

  if (contract.field) {
    it('rejects unknown field names', () => {
      const result = contract
        .create(ref({}))
        .apply({ term: 'Unit', fields: 'unsupported' })
      expect(result.isValid).toBe(false)
      expect(result.errors.fields).toBeTruthy()
    })
  }

  if (contract.advanced) {
    it.each(['any', 'all', undefined])(
      'preserves advanced conditions with match mode %s',
      (match) => {
        const conditions = JSON.stringify([
          {
            field: contract.field ?? 'description',
            operator: 'contains',
            value: 'Unit',
          },
        ])
        const result = contract
          .create(ref({}))
          .apply({ conditions, match, term: 'Ignored' })
        expect(result).toEqual({
          filters: { conditions, match: match === 'any' ? 'any' : 'all' },
          errors: {},
          isValid: true,
        })
      },
    )
  }
})

describe('additional search fields', () => {
  it('preserves inactive and non-system filters rather than dropping false', () => {
    expect(
      useCompanySearchHandlers(ref({})).handleFilterApply({ isActive: false })
        .filters.isActive,
    ).toBe(false)
    expect(
      useUsersSearchHandlers(ref({}), ref({})).handleAccountFilterApply({
        isSystem: false,
      }).filters.isSystem,
    ).toBe(false)
    expect(
      useRankSearchHandlers(ref({})).handleFilterApply({ search: ' Sergeant ' })
        .filters.term,
    ).toBe('Sergeant')
    expect(
      useCompanySearchHandlers(ref({})).handleFilterApply({
        battalionId: 'invalid',
      }).errors.battalionId,
    ).toBeTruthy()
    expect(
      useEquipmentSearchHandlers(ref({})).handleFilterApply({
        statusName: 'invalid',
      }).errors.statusName,
    ).toBeTruthy()
  })

  it('normalizes advanced deployment conditions and clears them on reset', () => {
    const filters = ref({})
    const controller = useDeploymentSearchHandlers(filters)
    expect(
      controller.handleDeploymentFilterApply({
        conditions: ' [] ',
        match: 'any',
      }).filters,
    ).toEqual({ conditions: '[]', match: 'any' })
    expect(
      controller.handleDeploymentFilterApply({ conditions: ' ' }).filters,
    ).toEqual({ conditions: undefined, match: 'all' })
    expect(controller.handleDeploymentFilterReset()).toEqual({})
    expect(filters.value).toEqual({})
  })

  it('validates actor names and date ranges for audit searches', () => {
    const query = ref('')
    const controller = useAuditSearchHandlers(query)
    controller.handleSearch('UPDATE')
    expect(query.value).toBe('UPDATE')
    expect(
      controller.handleFilterApply({
        term: ' UPDATE ',
        userName: ' Unit User ',
        startDate: '2026-10-01',
        endDate: '2026-10-04',
      }),
    ).toMatchObject({
      isValid: true,
      filters: { term: 'UPDATE', userName: 'Unit User' },
    })
    expect(controller.handleFilterApply({ userName: '<script>' }).isValid).toBe(
      false,
    )
    expect(
      controller.handleFilterApply({
        startDate: '2026-10-05',
        endDate: '2026-10-04',
      }).isValid,
    ).toBe(false)
    expect(
      controller.handleFilterApply({ conditions: '[]', match: 'any' }).filters,
    ).toEqual({ conditions: '[]', match: 'any' })
    expect(controller.handleFilterReset()).toEqual({})
  })
})
