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

  }
}
