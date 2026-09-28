import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import { BACKUP_FORMAT_VERSION, BACKUP_TABLES } from '../../../../server/shared/constants'
import { createSystemBackup } from '../../../../server/utils/backups/createSystemBackup'

describe('system backup configuration', () => {
  it('defines a versioned table allowlist without authentication sessions', () => {

  })
})
