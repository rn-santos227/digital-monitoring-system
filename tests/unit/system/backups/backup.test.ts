import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import { BACKUP_FORMAT_VERSION, BACKUP_TABLES } from '../../../../server/shared/constants'
import { createSystemBackup } from '../../../../server/utils/backups/createSystemBackup'

describe('system backup configuration', () => {
  it('defines a versioned table allowlist without authentication sessions', () => {
    expect(BACKUP_FORMAT_VERSION).toBe(1)
    expect(BACKUP_TABLES).toContain('personnel')
    expect(BACKUP_TABLES).toContain('equipment_assets')
    expect(BACKUP_TABLES).toContain('audit_logs')
    expect(BACKUP_TABLES).not.toContain('auth_sessions')
  })

  it('builds a backup from the allowlisted tables', async () => {
    const supabase = {
      from: vi.fn((tableName: string) => ({
        select: () => ({
          range: async () => ({ data: [{ tableName }], error: null }),
        }),
      })),
    } as unknown as SupabaseClient
  })
})
