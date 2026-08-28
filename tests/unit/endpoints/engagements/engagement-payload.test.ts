import { describe, expect, it } from 'vitest'

import {
  parseCreateEngagementPayload,
  parseCreateEngagementRecordPayload,
} from '../../../../server/shared/validations/domain/engagement-management'

describe('engagement endpoint payloads', () => {
  it('supports and normalizes schema-style engagement fields', () => {
   expect(parseCreateEngagementPayload({
      engagement_title: ' Community Coordination ',
      engagement_type_id: ' type-1 ',
      start_date: '2026-10-10',
      end_date: '2026-10-11',
      status_id: ' planned ',
    })).toMatchObject({
      engagement_title: 'Community Coordination',
      engagement_type_id: 'type-1',
      start_date: '2026-10-10',
      end_date: '2026-10-11',
      status_id: 'planned',
    })
  })
})
