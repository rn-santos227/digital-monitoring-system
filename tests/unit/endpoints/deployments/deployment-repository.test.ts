import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'deployments',
  table: 'deployments',
  entity: 'Deployment',
  payload: {
    deployment_area: 'Test Area',
    start_date: '2026-10-04',
    status_id: 'status-id',
  },
})

defineRepositoryUpdateTests('deployments', 'deployments', 'Deployment', {
  deployment_area: 'Updated Area',
})
