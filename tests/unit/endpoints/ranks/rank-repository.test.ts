import { defineRepositoryContractTests } from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'ranks',
  table: 'ranks',
  entity: 'Rank',
  returnsCreatedRow: true,
  payload: { code: 'SGT', name: 'Sergeant', sort_order: 3 },
})
