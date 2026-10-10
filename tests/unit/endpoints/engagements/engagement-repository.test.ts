import {
  defineRepositoryContractTests,
  defineRepositoryUpdateTests,
} from '@/tests/helpers/repository-contract'

defineRepositoryContractTests({
  domain: 'engagements',
  table: 'engagements',
  entity: 'Engagement',
  payload: {
    engagement_title: 'Test Engagement',
    engagement_type_id: 'type-id',
    status_id: 'status-id',
  },
})

defineRepositoryUpdateTests('engagements', 'engagements', 'Engagement', {
  engagement_title: 'Updated Engagement',
})
