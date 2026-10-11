import { useEngagementsStore } from '@/app/stores/engagements'
import { defineStoreCollectionTests } from '@/tests/helpers/store-contract'

defineStoreCollectionTests({
  name: 'engagements',
  useStore: useEngagementsStore,
  section: 'engagements',
  listPath: '/api/engagements',
  listThrows: false,
  decrementUnlisted: true,
  fetchAction: 'fetchEngagements',
  createAction: 'createEngagement',
  deleteAction: 'deleteEngagement',
  updateActions: ['updateEngagement'],
  row: { id: 'record', engagementTitle: 'Test Engagement', defaultRemarks: '' },
  payload: {
    engagement_title: 'Test Engagement',
    engagement_type_id: 'type',
    status_id: 'status',
  },
  updatePayload: { defaultRemarks: 'Updated' },
})

defineStoreCollectionTests({
  name: 'engagement records',
  useStore: useEngagementsStore,
  section: 'records',
  listPath: '/api/engagement-records',
  listThrows: false,
  fetchAction: 'fetchEngagementRecords',
  createAction: 'createEngagementRecord',
  deleteAction: 'deleteEngagementRecord',
  updateActions: ['updateEngagementRecord'],
  row: { id: 'record', recordNo: 'ENG-1', remarks: '' },
  payload: { personnel_id: 'personnel', engagement_id: 'engagement' },
  updatePayload: { remarks: 'Updated' },
})
