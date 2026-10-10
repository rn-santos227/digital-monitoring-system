import { describe, expect, it } from 'vitest'
import {
  parseCreateEngagementPayload,
  parseCreateEngagementRecordPayload,
} from '../../../../server/shared/validation/domain/engagement-management'

describe('engagement endpoint payloads', () => {
  it('supports and normalizes schema-style engagement fields', () => {
    expect(
      parseCreateEngagementPayload({
        engagement_title: ' Community Coordination ',
        engagement_type_id: ' type-1 ',
        start_date: '2026-10-10',
        end_date: '2026-10-11',
        status_id: ' planned ',
      }),
    ).toMatchObject({
      engagement_title: 'Community Coordination',
      engagement_type_id: 'type-1',
      start_date: '2026-10-10',
      end_date: '2026-10-11',
      status_id: 'planned',
    })
  })

  it('rejects an invalid engagement date range', () => {
    expect(() =>
      parseCreateEngagementPayload({
        engagementTitle: 'Community Coordination',
        startDate: '2026-10-11',
        endDate: '2026-10-10',
        statusId: 'planned',
      }),
    ).toThrow('End date must be on or after start date.')
  })

  it('requires personnel when creating an engagement record', () => {
    expect(() =>
      parseCreateEngagementRecordPayload({
        engagementId: 'engagement-1',
        personnelId: ' ',
      }),
    ).toThrow('Personnel id is required.')
  })
})
