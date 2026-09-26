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
   const from = page * BACKUP_PAGE_SIZE
    const to = from + BACKUP_PAGE_SIZE - 1
    const { data, error } = await supabase.from(tableName).select('*').range(from, to)

    if (error) {
      throw new Error(`Failed to back up ${tableName}: ${error.message}`)
    }

    const pageRecords = (data ?? []) as BackupRecord[]
    records.push(...pageRecords)

    if (pageRecords.length < BACKUP_PAGE_SIZE) {
      return records
    }

    page += 1
  }
}
