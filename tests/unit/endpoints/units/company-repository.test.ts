import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'companies',
  table: 'companies',
  entity: 'Company',
  payload: {
    code: 'CO-1',
    name: 'Test Company',
    battalion_id: 'battalion-id',
    is_active: true,
  },
})

defineRepositoryUpdateTests('companies', 'companies', 'Company', {
  battalion_id: null,
  name: 'Updated Company',
})
