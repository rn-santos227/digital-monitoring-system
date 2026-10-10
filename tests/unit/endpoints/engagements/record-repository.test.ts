import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'engagement-records',
  table: 'engagement_records',
  entity: 'EngagementRecord',
  payload: {
    personnel_id: 'personnel-id',
    engagement_id: 'engagement-id',
    role: 'Test role',
  },
})

defineRepositoryUpdateTests(
  'engagement-records',
  'engagement_records',
  'EngagementRecord',
  { role: 'Updated role' },
)
