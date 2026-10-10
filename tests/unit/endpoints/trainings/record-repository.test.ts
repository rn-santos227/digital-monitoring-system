import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'training-records',
  table: 'training_records',
  entity: 'TrainingRecord',
  payload: {
    personnel_id: 'personnel-id',
    training_id: 'training-id',
    certificate_no: 'CERT-1',
  },
})

defineRepositoryUpdateTests(
  'training-records',
  'training_records',
  'TrainingRecord',
  { certificate_no: 'CERT-2' },
)
