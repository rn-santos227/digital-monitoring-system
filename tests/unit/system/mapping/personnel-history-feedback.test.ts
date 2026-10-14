import { describe, expect, it } from 'vitest'
import { BACKUP_TABLES, PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS } from '@/server/shared/constants'
import { getBulkDomainDefinition } from '@/server/shared/utils/bulk-management'
import { mapPersonnelFeedbackItem } from '@/server/shared/utils/personnel-feedback'
import { PERSONNEL_PRIVILEGES } from '@/app/constants/privileges.constants'

describe('personnel feedback snapshots and safety coverage', () => {
  it('maps the saved author snapshot rather than replacing it with current personnel data', () => {
    expect(mapPersonnelFeedbackItem({
      id: 'feedback', personnel_id: 'person', feedback: 'Meets expectations.', review_date: '2026-10-12', rating: null,
      author_user_id: 'author', author_personnel_id: 'official', author_name: 'Juan Dela Cruz', author_title: 'Commander',
      author_rank: 'Captain', author_service_number: 'SN-123', officiated_at: '2026-10-12T00:00:00Z',
    })).toMatchObject({ authorName: 'Juan Dela Cruz', authorRank: 'Captain', authorServiceNumber: 'SN-123', officiatedAt: '2026-10-12T00:00:00Z' })
  })

  it('includes all new tables in backups and personnel deletion checks', () => {
    for (const table of ['personnel_employment_records', 'personnel_education_records', 'personnel_performance_feedback'] as const) {
      expect(BACKUP_TABLES).toContain(table)
      expect(PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS).toContainEqual(expect.objectContaining({ table, column: 'personnel_id' }))
      expect(getBulkDomainDefinition('personnel')?.deleteReferences).toContainEqual({ table, column: 'personnel_id' })
    }
    expect(getBulkDomainDefinition('users')?.deleteReferences).toContainEqual({ table: 'personnel_performance_feedback', column: 'author_user_id' })
  })

  it('requires an explicit official feedback privilege and offers no bulk mutation of officiated entries', () => {
    expect(PERSONNEL_PRIVILEGES.feedback).toEqual(['personnel.feedback'])
    expect(getBulkDomainDefinition('personnel_performance_feedback')).toBeUndefined()
    expect(getBulkDomainDefinition('performance-feedback')).toBeUndefined()
  })
})
