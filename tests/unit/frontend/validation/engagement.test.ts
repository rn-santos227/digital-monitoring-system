import {
  validateCreateEngagementForm,
  validateCreateEngagementRecordForm,
} from '@/app/utils/engagement-validation'
import { defineFormContractTests } from '@/tests/helpers/form-contract'

defineFormContractTests({
  name: 'engagement form',
  validate: validateCreateEngagementForm,
  form: {
    engagementTitle: ' Test Engagement ',
    engagementTypeId: 'type',
    statusId: 'status',
    levelId: 'Local',
    startDate: '2026-10-04',
    endDate: '2026-10-05',
    defaultRemarks: ' Test ',
  },
  required: ['engagementTitle', 'engagementTypeId', 'statusId'],
  optional: ['levelId', 'startDate', 'endDate', 'defaultRemarks'],
  expected: { engagement_title: 'Test Engagement', default_remarks: 'Test' },
})
defineFormContractTests({
  name: 'engagement record form',
  validate: validateCreateEngagementRecordForm,
  form: {
    personnel_id: 'personnel',
    engagement_id: 'engagement',
    role: ' Operator ',
    location: ' HQ ',
    start_date: '2026-10-04',
    end_date: '2026-10-05',
    remarks: ' Test ',
  },
  required: ['personnel_id', 'engagement_id'],
  optional: ['role', 'location', 'start_date', 'end_date', 'remarks'],
  expected: { role: 'Operator', location: 'HQ', remarks: 'Test' },
})
