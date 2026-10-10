import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'trainings',
  table: 'trainings',
  entity: 'Training',
  payload: {
    training_title: 'Test Training',
    start_date: '2026-10-04',
    status_id: 'status-id',
  },
})

defineRepositoryUpdateTests('trainings', 'trainings', 'Training', {
  training_title: 'Updated Training',
})
