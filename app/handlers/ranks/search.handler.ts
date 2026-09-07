import type { Ref } from 'vue'
import { RANK_FILTER_FIELD_OPTIONS } from '~/constants/page.constants'
import type { RankListQuery } from '~/types/domain/rank'
import { validateFields } from '~/utils/field-validation'
import { REGEX_PATTERNS } from '~/utils/regex'

const RANK_SEARCHABLE_FIELDS = RANK_FILTER_FIELD_OPTIONS
  .map(option => option.value)
  .filter(Boolean)

export const useRankSearchHandlers = (filters: Ref<Partial<RankListQuery>>) => {
  const handleFilterApply = (value: Partial<RankListQuery>) => {
    if (value.conditions) {
      const sanitizedFilters: Partial<RankListQuery> = {
        conditions: value.conditions,
        match: value.match === 'any' ? 'any' : 'all',
      }

      return {
        filters: sanitizedFilters,
        errors: {},
        isValid: true,
      }
    }

    const validation = validateFields([
      {
        field: 'term',
        label: 'Search term',
        value: value.term ?? value.search ?? '',
        maxLength: 120,
        pattern: REGEX_PATTERNS.alphaNumericSpace,
        patternMessage: 'Search term allows letters, numbers, spaces, periods, underscores, and hyphens only.',
      },
      {
        field: 'fields',
        label: 'Search field',
        value: value.fields ?? '',
        maxLength: 64,
      },

    ])
  }
}
