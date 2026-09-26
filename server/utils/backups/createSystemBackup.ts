import type { SupabaseClient } from '@supabase/supabase-js'
import { BACKUP_FORMAT_VERSION, BACKUP_TABLES, type BackupTableName } from '../../shared/constants'
import type { BackupRecord, SystemBackup } from '../../shared/models'
import { fetchAllTableRecords } from './fetchAllTableRecords'

export const createSystemBackup = async (
  supabase: SupabaseClient,
  generatedAt: string,
  generatedBy: string,
): Promise<SystemBackup> => {
  const tableEntries = await Promise.all(BACKUP_TABLES.map(async (tableName) => {
    const records = await fetchAllTableRecords(supabase, tableName)
    return [tableName, records] as const
  }))
 const tables = Object.fromEntries(tableEntries) as Record<BackupTableName, BackupRecord[]>


}