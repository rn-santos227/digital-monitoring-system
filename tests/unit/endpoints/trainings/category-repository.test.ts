import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'training-categories',
  table: 'training_categories',
  entity: 'TrainingCategory',
  payload: { code: 'BASIC', name: 'Basic Training' },
})

defineRepositoryUpdateTests(
  'training-categories',
  'training_categories',
  'TrainingCategory',
  { name: 'Updated Category' },
)
