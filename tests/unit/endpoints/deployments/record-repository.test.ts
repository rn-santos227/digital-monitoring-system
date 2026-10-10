import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'deployment-records',
  table: 'deployment_records',
  entity: 'DeploymentRecord',
  payload: {
    personnel_id: 'personnel-id',
    deployment_id: 'deployment-id',
    deployment_area: 'Test Area',
    start_date: '2026-10-04',
  },
})

defineRepositoryUpdateTests(
  'deployment-records',
  'deployment_records',
  'DeploymentRecord',
  { remarks: 'Updated' },
)
