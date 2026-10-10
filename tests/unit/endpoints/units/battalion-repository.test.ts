import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'battalions',
  table: 'battalions',
  entity: 'Battalion',
  payload: { code: 'UNIT-1', name: 'Test Battalion', is_active: true },
})

defineRepositoryUpdateTests('battalions', 'battalions', 'Battalion', {
  name: 'Updated Battalion',
})
