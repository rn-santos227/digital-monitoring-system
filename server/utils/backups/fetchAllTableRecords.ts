import type { SupabaseClient } from '@supabase/supabase-js'
import { BACKUP_PAGE_SIZE, type BackupTableName } from '../../shared/constants'
import type { BackupRecord } from '../../shared/models'

export const fetchAllTableRecords = async (
  supabase: SupabaseClient,
  tableName: BackupTableName,
): Promise<BackupRecord[]> => {
  const records: BackupRecord[] = []
  let page = 0

  while (true) {

  }
}
